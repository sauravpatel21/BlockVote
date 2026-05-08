import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";

function AdminPanel() {
  const { auth, account, connectWallet, addCandidate, status } = useBlockVote();
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [image, setImage] = useState("");

  if (!auth.token || auth.user?.role !== "admin") {
    return <Navigate to="/admin-login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect MetaMask first.");
      return;
    }
    await addCandidate({ name, party, image });
    setName("");
    setParty("");
    setImage("");
  };

  return (
    <div className="admin-container" style={{ marginTop: '20px' }}>
      <h2 className="vote-title" style={{ color: "var(--danger)" }}>Add New Candidate</h2>
      
      {!account ? (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button className="btn danger" onClick={connectWallet}>Connect MetaMask</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div className="success" style={{ marginBottom: "10px" }}>
            Admin Wallet Connected: {account.slice(0,6)}...{account.slice(-4)}
          </div>
          <div style={{ background: "rgba(231, 76, 60, 0.1)", color: "var(--danger)", padding: "10px", borderRadius: "8px", border: "1px solid var(--danger)", fontSize: "14px" }}>
            ⚠️ <strong>CRITICAL:</strong> Your MetaMask wallet MUST be the exact same wallet that deployed the Smart Contract, or the blockchain will reject your candidate!
          </div>
        </div>
      )}

      <p style={{ textAlign: "center", marginBottom: "20px" }} className="muted">
        {status}
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Candidate Name</label>
          <div className="control">
            <input 
              type="text" 
              className="input" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Party Name</label>
          <div className="control">
            <input 
              type="text" 
              className="input" 
              value={party}
              onChange={e => setParty(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Image URL (Optional)</label>
          <div className="control">
            <input 
              type="url" 
              className="input" 
              value={image}
              onChange={e => setImage(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn danger" style={{ width: "100%", marginTop: "10px" }} disabled={!account}>Upload & Add Candidate</button>
      </form>
    </div>
  );
}

export default AdminPanel;
