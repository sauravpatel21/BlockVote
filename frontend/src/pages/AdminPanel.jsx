import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";
import "../admin.css";

function AdminPanel() {
  const { auth, account, connectWallet, addCandidate, deleteCandidate, candidates, loadCandidates, status } = useBlockVote();
  const [activeTab, setActiveTab] = useState("add");
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  if (!auth.token || auth.user?.role !== "admin") {
    return <Navigate to="/admin-login" />;
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect MetaMask first.");
      return;
    }
    await addCandidate({ name, party, age, photo, logo });
    setName(""); setParty(""); setAge(""); setPhoto(""); setLogo("");
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete candidate "${name}"?`)) {
      await deleteCandidate(id);
    }
  };

  // Calculate stats
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <div className="admin-page-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <button className={`sidebar-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Add Candidate</button>
        <button className={`sidebar-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Total Votes</button>
        <button className={`sidebar-btn ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>All Candidates</button>
        <button className={`sidebar-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>📊 View Results</button>
      </aside>

      <main className="admin-main">
        {activeTab === 'add' && (
          <section className="admin-section">
            <h2>Add New Candidate</h2>
            
            {!account ? (
              <div style={{ marginBottom: "20px" }}>
                <button className="btn danger" onClick={connectWallet}>Connect MetaMask</button>
              </div>
            ) : (
              <div style={{ marginBottom: "20px", color: "var(--success)", fontWeight: "bold" }}>
                Wallet Connected: {account.slice(0,6)}...{account.slice(-4)}
              </div>
            )}
            
            <p className="muted">{status}</p>

            <form className="form" onSubmit={handleAddSubmit}>
              <div className="field">
                <label className="label">Candidate Name</label>
                <div className="control">
                  <input className="input" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Age</label>
                <div className="control">
                  <input className="input" type="number" value={age} onChange={e => setAge(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Party Name</label>
                <div className="control">
                  <input className="input" value={party} onChange={e => setParty(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Candidate Photo URL</label>
                <div className="control">
                  <input className="input" type="url" value={photo} onChange={e => setPhoto(e.target.value)} required placeholder="https://..." />
                </div>
              </div>
              <div className="field">
                <label className="label">Party Logo URL</label>
                <div className="control">
                  <input className="input" type="url" value={logo} onChange={e => setLogo(e.target.value)} required placeholder="https://..." />
                </div>
              </div>
              <button type="submit" className="btn danger" disabled={!account}>Upload & Add Candidate</button>
            </form>
          </section>
        )}

        {activeTab === 'summary' && (
          <section className="admin-section">
            <h2>Total Votes Summary</h2>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary)" }}>
              Total Votes Cast: {totalVotes}
            </div>
            <div style={{ marginTop: "20px" }}>
              {candidates.map(c => (
                <div key={c.id} style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
                  {c.name} ({c.party}): <strong>{c.votes} votes</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'candidates' && (
          <section className="admin-section">
            <h2>👥 All Candidates</h2>
            <button className="btn" onClick={loadCandidates} style={{ marginBottom: "20px" }}>🔄 Refresh List</button>
            
            {candidates.length === 0 ? (
              <p className="muted">No candidates found.</p>
            ) : (
              <div className="candidates-wrapper">
                {candidates.map(c => (
                  <div key={c.id} className="admin-candidate-card">
                    <div className="candidate-header">
                      <img src={c.photo || "https://via.placeholder.com/64"} alt={c.name} className="candidate-photo" />
                      <div className="candidate-info">
                        <h3>{c.name}</h3>
                        <p>Age: {c.age || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="candidate-party">
                      <img src={c.logo || "https://via.placeholder.com/32"} alt={c.party} className="party-logo" />
                      <strong>{c.party}</strong>
                    </div>
                    <div className="candidate-actions">
                      <button className="delete-btn" onClick={() => handleDelete(c.id, c.name)}>
                        🗑️ Delete Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'results' && (
          <section className="admin-section">
            <h2>📊 Live Voting Results</h2>
            <button className="btn" onClick={loadCandidates} style={{ marginBottom: "20px" }}>🔄 Refresh Results</button>
            
            <div>
              {sortedCandidates.map((c, idx) => {
                const percentage = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;
                return (
                  <div key={c.id} className="result-item">
                    <div className="result-header">
                      <div>
                        <h3>{c.name}</h3>
                        <p>{c.party} • {c.votes} votes ({percentage}%)</p>
                      </div>
                      <div className="rank-badge">{idx + 1}</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
