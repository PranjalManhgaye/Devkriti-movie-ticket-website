import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Please log in.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="signup-email">Email:</label>
        <input id="signup-email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label htmlFor="signup-password">Password:</label>
        <input id="signup-password" name="password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label htmlFor="signup-role">Role:</label>
        <select id="signup-role" name="role" autoComplete="role" value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" id="signup-submit" name="signup-submit">Sign Up</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;
