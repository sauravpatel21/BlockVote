import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";

function Signup() {
  const [voterId, setVoterId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const { requestOtp, verifyOtp, status } = useBlockVote();
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    const success = await requestOtp(voterId, email, "signup");
    if (success) setStep(2);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const success = await verifyOtp(voterId, email, otp, "signup");
    if (success) navigate("/vote");
  };

  return (
    <div className="home-container" style={{ marginTop: '20px' }}>
      <h2 className="vote-title">Create your Account</h2>
      <p style={{ textAlign: "center", marginBottom: "20px" }} className="muted">
        {status}
      </p>

      {step === 1 ? (
        <form className="form" onSubmit={handleRequest}>
          <div className="field">
            <label className="label">Voter ID (3 Letters, 7 Digits)</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. ABC1234567" 
                value={voterId}
                maxLength={10}
                onChange={e => setVoterId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                required
              />
            </div>
            <p className="help">Format: 3 letters followed by 7 digits.</p>
          </div>
          <div className="field">
            <label className="label">Email Address</label>
            <div className="control">
              <input 
                type="email" 
                className="input" 
                placeholder="voter@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn" style={{ width: "100%", marginTop: "10px" }}>Request OTP</button>
        </form>
      ) : (
        <form className="form" onSubmit={handleVerify}>
          <div className="field">
            <label className="label">Enter 6-digit OTP sent to {email}</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                placeholder="123456" 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn" style={{ width: "100%", marginTop: "10px" }}>Verify & Register</button>
        </form>
      )}
      
      <p className="footer-note" style={{ textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ textDecoration: "underline", color: "var(--primary)" }}>Login</Link>
      </p>
    </div>
  );
}

export default Signup;
