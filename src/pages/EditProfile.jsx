import React, { useState } from "react";

function EditProfile() {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
        localStorage.setItem('email', email); // update local email
        setPassword('');
      } else {
        setError(data.message || 'Update failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="edit-email">Email:</label>
        <input
          id="edit-email"
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="edit-password">New Password:</label>
        <input
          id="edit-password"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Leave blank to keep current password"
        />
        <button type="submit">Update Profile</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
    </div>
  );
}

export default EditProfile;
