import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        setMessage("Login successful!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="login-email">Email:</label>
        <input id="login-email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label htmlFor="login-password">Password:</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />

        <label htmlFor="login-role">Role:</label>
        <select id="login-role" name="role" autoComplete="role" value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" id="login-submit" name="login-submit">Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}


export default Login;
