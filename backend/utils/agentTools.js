const axios = require('axios');

async function getWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await axios.get(url);
  const data = res.data;
  return {
    city: data.name,
    temp: data.main.temp,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
}

async function getNews(topic) {
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(topic)}&apiKey=${apiKey}&language=en`;
  const res = await axios.get(url);
  return res.data;
}

module.exports = { getWeather, getNews }; 