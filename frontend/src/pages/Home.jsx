import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="wrap home-wrap">
      <div style={{ padding: "14px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--danger)" }}>⚠️ Demo Phase Disclaimer</h4>
        <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
          This website is currently in a demo phase. For the MetaMask and POL token requirements, the platform is still connected to my wallet, meaning gas payments for voting only go through my personal wallet.
        </p>
      </div>
      <div className="grid">
        <section className="card pad reveal is-visible">
          <div className="stack">
            <h1 className="h1">Secure, verifiable voting built for trust.</h1>
            <p className="lead">
              BlockVote is a blockchain-based voting platform designed for security, transparency,
              and reliable vote counting without compromising usability.
            </p>
            <div className="actions">
              <Link className="btn" to="/login">Login to vote</Link>
              <Link className="btn secondary" to="/signup">Create an account</Link>
            </div>
            <p className="footer-note">Tip: Turn on dark mode from the top right.</p>
          </div>
        </section>

        <aside className="card pad reveal delay-1 is-visible">
          <div className="stack">
            <div className="pill">Why BlockVote</div>
            <div className="list">
              <div className="tile">
                <h3>🔐 Secure</h3>
                <p>Vote records are tamper-resistant and auditable.</p>
              </div>
              <div className="tile">
                <h3>🕊️ Transparent</h3>
                <p>Counting is verifiable for stronger integrity.</p>
              </div>
              <div className="tile">
                <h3>⚖️ Fair</h3>
                <p>Decentralized design reduces single points of failure.</p>
              </div>
            </div>
            <div className="spacer"></div>
            <Link className="btn danger" to="/admin-login">Admin login</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
