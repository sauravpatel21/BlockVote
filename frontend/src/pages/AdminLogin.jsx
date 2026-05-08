import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useBlockVote } from "../context/BlockVoteContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setStatus } = useBlockVote();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/admin/login`, { email, password });
      localStorage.setItem("blockvote_token", res.data.token);
      localStorage.setItem("blockvote_user", JSON.stringify(res.data.user));
      // Refresh to update context
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="admin-container" style={{ marginTop: '20px' }}>
      <h2 className="vote-title" style={{ color: "var(--danger)" }}>Admin Portal</h2>
      {error && <p style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>}
      <form className="form" onSubmit={handleLogin}>
        <div className="field">
          <label className="label">Admin Email</label>
          <div className="control">
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn danger" style={{ width: "100%", marginTop: "10px" }}>Admin Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
