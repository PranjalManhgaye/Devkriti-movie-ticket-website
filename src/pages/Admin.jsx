import React, { useEffect, useState } from "react";

function Admin() {
  const email = localStorage.getItem('email') || '';
  const role = localStorage.getItem('role') || '';
  const token = localStorage.getItem('token');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', posterUrl: '', trailerUrl: '', genre: '', language: '', duration: '', year: '', format: '', rating: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch movies
  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(setMovies)
      .catch(() => setError('Failed to fetch movies'))
      .finally(() => setLoading(false));
  }, [message]);

  // Handle form input
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Add or update movie
  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setMessage('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/api/movies/${editId}` : 'http://localhost:5000/api/movies';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(editId ? 'Movie updated!' : 'Movie added!');
        setForm({ title: '', description: '', posterUrl: '', trailerUrl: '', genre: '', language: '', duration: '', year: '', format: '', rating: '' });
        setEditId(null);
      } else {
        setError(data.message || 'Error');
      }
    } catch {
      setError('Network error');
    }
  };

  // Delete movie
  const handleDelete = async id => {
    if (!window.confirm('Delete this movie?')) return;
    setError(''); setMessage('');
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessage('Movie deleted!');
      else setError(data.message || 'Error');
    } catch {
      setError('Network error');
    }
  };

  // Start editing
  const startEdit = m => {
    setEditId(m._id);
    setForm({
      title: m.title || '',
      description: m.description || '',
      posterUrl: m.posterUrl || '',
      trailerUrl: m.trailerUrl || '',
      genre: m.genre || '',
      language: m.language || '',
      duration: m.duration || '',
      year: m.year || '',
      format: m.format || '',
      rating: m.rating || ''
    });
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Email:</strong> {email} <br />
        <strong>Role:</strong> {role === 'admin' ? <span style={{color: '#f72585', fontWeight: 'bold'}}>Admin</span> : 'User'}
      </div>
      <h3>Movie Management</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {/* Movie Form */}
      {role === 'admin' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#222', padding: 16, borderRadius: 8 }}>
          <h4>{editId ? 'Edit' : 'Add'} Movie</h4>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required style={{marginRight:8}} />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{marginRight:8}} />
          <input name="posterUrl" value={form.posterUrl} onChange={handleChange} placeholder="Poster URL" style={{marginRight:8}} />
          <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange} placeholder="Trailer URL" style={{marginRight:8}} />
          <input name="genre" value={form.genre} onChange={handleChange} placeholder="Genre" style={{marginRight:8}} />
          <input name="language" value={form.language} onChange={handleChange} placeholder="Language" style={{marginRight:8}} />
          <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (min)" type="number" style={{marginRight:8}} />
          <input name="year" value={form.year} onChange={handleChange} placeholder="Year" type="number" style={{marginRight:8}} />
          <input name="format" value={form.format} onChange={handleChange} placeholder="Format" style={{marginRight:8}} />
          <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" style={{marginRight:8}} />
          <button type="submit">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={()=>{setEditId(null);setForm({ title: '', description: '', posterUrl: '', trailerUrl: '', genre: '', language: '', duration: '', year: '', format: '', rating: '' });}}>Cancel</button>}
        </form>
      )}
      {/* Movie List */}
      {loading ? <div>Loading movies...</div> : (
        <table style={{ width: '100%', background: '#181828', color: '#fff', borderRadius: 8 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m._id}>
                <td>{m.title}</td>
                <td>{m.description}</td>
                <td>{m.year}</td>
                <td>
                  {role === 'admin' && <>
                    <button onClick={() => startEdit(m)} style={{marginRight:8}}>Edit</button>
                    <button onClick={() => handleDelete(m._id)} style={{color:'red'}}>Delete</button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


export default Admin;
