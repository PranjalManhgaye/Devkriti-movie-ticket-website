const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const path = require('path');
const localMovies = require(path.join(__dirname, '../data/data.json'));

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// --- Helper: TMDb Genre Map (can be cached or fetched at startup) ---
const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science fiction': 878,
  'sci-fi': 878,
  thriller: 53,
  war: 10752,
  western: 37
};

// --- Intent Extraction ---
function extractIntent(text) {
  const lower = text.toLowerCase();
  // City extraction (expand as needed)
  const cityMatch = lower.match(/in ([a-zA-Z ]+)/);
  let city = cityMatch ? cityMatch[1].trim().split(' ')[0] : null;
  // Genre extraction
  let genre = null;
  for (const g in GENRE_MAP) {
    if (lower.includes(g)) {
      genre = g;
      break;
    }
  }
  // Language extraction (ISO 639-1)
  let language = null;
  if (lower.includes('hindi')) language = 'hi';
  else if (lower.includes('english')) language = 'en';
  else if (lower.includes('french')) language = 'fr';
  // Date extraction
  let date = null;
  if (lower.includes('today')) date = 'today';
  else if (lower.includes('tonight')) date = 'tonight';
  else if (lower.includes('weekend')) date = 'weekend';
  // Movie title extraction (very basic)
  const titleMatch = lower.match(/(?:movie|film|watch|show) ([a-zA-Z0-9: ]+)/);
  let title = titleMatch ? titleMatch[1].trim() : null;
  return { city, genre, language, date, title };
}

function findLocalMovies({ title, genre, language }) {
  let results = localMovies;
  if (title) {
    results = results.filter(m => m.Title && m.Title.toLowerCase().includes(title.toLowerCase()));
  }
  if (genre) {
    results = results.filter(m => m.Genre && m.Genre.toLowerCase().includes(genre.toLowerCase()));
  }
  if (language) {
    results = results.filter(m => m.Language && m.Language.toLowerCase().includes(language.toLowerCase()));
  }
  return results;
}

// --- TMDb API Calls ---
async function getMoviesByGenreLanguage({ genre, language, date }) {
  const params = {
    api_key: TMDB_API_KEY,
    sort_by: 'popularity.desc',
    with_genres: genre ? GENRE_MAP[genre] : undefined,
    with_original_language: language,
    'primary_release_date.gte': date === 'today' ? new Date().toISOString().slice(0, 10) : undefined,
    page: 1
  };
  // Remove undefined
  Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
  const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
  return res.data.results;
}

async function getMovieDetails(title) {
  const params = {
    api_key: TMDB_API_KEY,
    query: title,
    page: 1
  };
  const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });
  return res.data.results[0];
}

// NEW: Fetch cast with images for a movie by TMDb movie ID
async function getMovieCast(movieId) {
  const params = { api_key: TMDB_API_KEY };
  const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, { params });
  // Only main cast, with images
  return (res.data.cast || []).slice(0, 8).map(c => ({
    name: c.name,
    character: c.character,
    profile: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
  }));
}

// --- Gemini setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const SYSTEM_INSTRUCTION = `You are Pranjal, a sharp-tongued, brutally honest, and hilariously savage movie consultant on a ticket booking platform. You:

- Roast users (lightly) while recommending movies by genre, language, or mood
- Give snappy answers about showtimes and theaters in specific cities (if available)
- Handle queries like "What are the best Hindi movies today in Delhi?" or "Suggest an action movie to watch tonight" — but make it sound like you're the king of cinema
- Never sugarcoat. If you don’t have the data, say something like: "Look, I don’t have real-time data, but here’s what’s hot anyway. You’re welcome."
- NEVER make up showtimes or theaters — you're savage, not a liar
- Respond in witty, sarcastic, and bold language. Be fun, flirty, and fearless — like a movie nerd who could roast you and still get you the best recommendation
- Keep your tone cool, confident, and always on top — like you're the main character and everyone else is background noise

Examples:
User: “Any romantic movies tonight?”
Pranjal: “Aww, someone’s feeling mushy. Try ‘The Notebook’—but don’t blame me if you end up crying in your popcorn.”

User: “What’s good in Mumbai today?”
Pranjal: “Mumbai’s got more drama than a reality show. ‘Jawan’, ‘Deadpool 3’, and ‘Oppenheimer’ are slaying. Pick one, superstar.”

Keep it respectful. You're Pranjal — and boring bots could never.

`;

// --- Main chat route ---
router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ reply: 'No message provided.' });
    const { city, genre, language, date, title } = extractIntent(userMessage);
    let reply = null;

    // --- For exact title matches, try local JSON first ---
    if (title) {
      const exactLocal = localMovies.find(m => m.Title && m.Title.toLowerCase() === title.toLowerCase());
      if (exactLocal) {
        const movie = {
          title: exactLocal.Title,
          year: exactLocal.Year,
          poster: exactLocal.Poster,
          rating: exactLocal.imdbRating,
          overview: exactLocal.Plot,
          actors: exactLocal.Actors,
          images: exactLocal.Images,
          genre: exactLocal.Genre,
          language: exactLocal.Language
        };
        return res.json({
          reply: `Found "${exactLocal.Title}" in our local database:`,
          movies: [movie]
        });
      }
    }

    // --- For genre/language queries, try TMDb first, fallback to local ---
    if (genre || language || date) {
      try {
        // Try TMDb first
        const tmdbResults = await getMoviesByGenreLanguage({ genre, language, date });
        if (tmdbResults && tmdbResults.length > 0) {
          const movies = tmdbResults.slice(0, 5).map(m => ({
            title: m.title,
            year: m.release_date ? m.release_date.slice(0, 4) : '',
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average,
            overview: m.overview,
            id: m.id
          }));
          return res.json({
            reply: `Here are some popular${genre ? ' ' + genre : ''}${language ? ' ' + language : ''} movies${date ? ' for ' + date : ''}:`,
            movies
          });
        }
      } catch (tmdbError) {
        console.log('TMDb failed, falling back to local data:', tmdbError.message);
        // TMDb failed, try local JSON as fallback
        const localResults = findLocalMovies({ genre, language });
        if (localResults && localResults.length > 0) {
          const movies = localResults.slice(0, 5).map(m => ({
            title: m.Title,
            year: m.Year,
            poster: m.Poster,
            rating: m.imdbRating,
            overview: m.Plot,
            actors: m.Actors,
            images: m.Images,
            genre: m.Genre,
            language: m.Language
          }));
          return res.json({
            reply: `TMDb is unavailable. Here are some${genre ? ' ' + genre : ''}${language ? ' ' + language : ''} movies from our local database:`,
            movies
          });
        }
      }
    }

    // --- For title queries not found locally, try TMDb ---
    if (title) {
      try {
        const movie = await getMovieDetails(title);
        if (movie) {
          let cast = [];
          try {
            cast = await getMovieCast(movie.id);
          } catch (e) { cast = []; }
          return res.json({
            reply: `"${movie.title}" (${movie.release_date?.slice(0,4)}): ${movie.overview}` + (cast.length ? `\nCast: ${cast.map(c => c.name).join(', ')}` : ''),
            movies: [{
              title: movie.title,
              year: movie.release_date ? movie.release_date.slice(0, 4) : '',
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              rating: movie.vote_average,
              overview: movie.overview,
              id: movie.id,
              cast
            }]
          });
        }
      } catch (tmdbError) {
        console.log('TMDb failed for title search:', tmdbError.message);
        // TMDb failed, try local JSON as fallback
        const localResults = findLocalMovies({ title });
        if (localResults && localResults.length > 0) {
          const movies = localResults.slice(0, 5).map(m => ({
            title: m.Title,
            year: m.Year,
            poster: m.Poster,
            rating: m.imdbRating,
            overview: m.Plot,
            actors: m.Actors,
            images: m.Images,
            genre: m.Genre,
            language: m.Language
          }));
          return res.json({
            reply: `TMDb is unavailable. Here are some movies matching "${title}" from our local database:`,
            movies
          });
        }
      }
    }

    // --- If no data found anywhere, ask Gemini to generate a smart reply ---
    if (!reply) {
      const geminiRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      reply = geminiRes.text || "I'm sorry, I couldn't find any movies matching your request. Try asking for a different movie or genre.";
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err?.response?.data || err.message || err);
    res.status(500).json({ reply: 'Sorry, something went wrong. Please try again later.' });
  }
});

// --- Show more (pagination) endpoint ---
router.get('/chat/more', async (req, res) => {
  try {
    const userMessage = req.query.q;
    const page = parseInt(req.query.page, 10) || 1;
    if (!userMessage) return res.status(400).json({ reply: 'No query provided.' });
    const { genre, language, date } = extractIntent(userMessage);
    if (genre || language || date) {
      const params = {
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        with_genres: genre ? GENRE_MAP[genre] : undefined,
        with_original_language: language,
        'primary_release_date.gte': date === 'today' ? new Date().toISOString().slice(0, 10) : undefined,
        page
      };
      Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
      const tmdbRes = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
      const movies = (tmdbRes.data.results || []).slice(0, 5).map(m => ({
        title: m.title,
        year: m.release_date ? m.release_date.slice(0, 4) : '',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        rating: m.vote_average,
        overview: m.overview,
        id: m.id
      }));
      return res.json({ movies });
    }
    return res.json({ movies: [] });
  } catch (err) {
    console.error('Show more error:', err?.response?.data || err.message || err);
    res.status(500).json({ movies: [] });
  }
});

// --- TMDb trailer proxy endpoint ---
router.get('/tmdb/movie/:id/videos', async (req, res) => {
  try {
    const id = req.params.id;
    const params = { api_key: TMDB_API_KEY };
    const tmdbRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}/videos`, { params });
    res.json(tmdbRes.data);
  } catch (err) {
    res.status(500).json({ results: [] });
  }
});

// NEW: Endpoint to fetch cast for a movie by TMDb ID
router.get('/tmdb/movie/:id/cast', async (req, res) => {
  try {
    const id = req.params.id;
    const params = { api_key: TMDB_API_KEY };
    const tmdbRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits`, { params });
    const cast = (tmdbRes.data.cast || []).slice(0, 8).map(c => ({
      name: c.name,
      character: c.character,
      profile: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
    }));
    res.json({ cast });
  } catch (err) {
    res.status(500).json({ cast: [] });
  }
});

module.exports = router; 