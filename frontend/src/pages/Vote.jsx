import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";

function Vote() {
  const { auth, account, connectWallet, candidates, loadCandidates, onVote, status, hasVoted } = useBlockVote();

  useEffect(() => {
    if (auth.token) {
      loadCandidates();
    }
  }, [auth.token, loadCandidates]);

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="wrap">
      <h2 className="vote-title">Cast Your Vote</h2>
      
      {!account ? (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p className="muted" style={{ marginBottom: "10px" }}>Connect your wallet to cast your vote on Polygon Amoy.</p>
          <button className="submit-btn" onClick={connectWallet}>Connect MetaMask</button>
          <p id="metamaskStatus" className={status ? "error" : ""} style={{ display: status ? "block" : "none" }}>{status}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div id="metamaskStatus" className="success">Connected: {account.slice(0,6)}...{account.slice(-4)}</div>
          {hasVoted && <div style={{ marginTop: "15px", background: "rgba(39, 174, 96, 0.1)", color: "#27ae60", padding: "10px", borderRadius: "8px", border: "1px solid #27ae60", fontWeight: "bold" }}>✅ You have successfully cast your vote on the blockchain!</div>}
          <p className="muted" style={{ marginTop: "10px" }}>Status: {status}</p>
        </div>
      )}

      <div className="candidate-wrapper">
        {candidates.map((c) => (
          <div className="card candidate-card stack center" key={c.id}>
            {c.image ? (
              <img src={c.image} alt={c.name} className="candidate-photo" />
            ) : (
              <div className="candidate-photo" style={{ background: "var(--card2)", display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
            )}
            <h3 style={{ margin: "0", fontSize: "18px" }}>{c.name}</h3>
            <span className="pill">{c.party}</span>
            <p className="muted" style={{ margin: "0", fontSize: "14px" }}>Current Votes: {c.votes}</p>
            <button 
              className="submit-btn" 
              style={{ width: "100%", marginTop: "10px", opacity: hasVoted ? 0.5 : 1, cursor: hasVoted ? "not-allowed" : "pointer" }}
              disabled={!account || hasVoted}
              onClick={() => onVote(c.id)}
            >
              {hasVoted ? "Already Voted" : "Vote"}
            </button>
          </div>
        ))}
        {candidates.length === 0 && (
          <p className="muted" style={{ gridColumn: "1/-1", textAlign: "center" }}>No candidates found.</p>
        )}
      </div>
    </div>
  );
}

export default Vote;
