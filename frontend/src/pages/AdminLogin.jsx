import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const { requestAdminOtp, verifyAdminOtp, status } = useBlockVote();
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    const success = await requestAdminOtp(email);
    if (success) setStep(2);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const success = await verifyAdminOtp(email, otp);
    if (success) window.location.href = "/admin"; // Force reload to apply admin context
  };

  return (
    <div className="admin-container" style={{ marginTop: '20px' }}>
      <h2 className="vote-title" style={{ color: "var(--danger)" }}>Admin Portal</h2>
      <p style={{ textAlign: "center", marginBottom: "20px" }} className="muted">
        {status}
      </p>

      {step === 1 ? (
        <form className="form" onSubmit={handleRequest}>
          <div className="field">
            <label className="label">Admin Email Address</label>
            <div className="control">
              <input 
                type="email" 
                className="input" 
                placeholder="admin@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn danger" style={{ width: "100%", marginTop: "10px" }}>Request Admin Access</button>
        </form>
      ) : (
        <form className="form" onSubmit={handleVerify}>
          <div className="field">
            <label className="label">Enter 6-digit Admin OTP sent to {email}</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                placeholder="123456" 
                value={otp}
                maxLength={6}
                pattern="[0-9]{6}"
                title="Must be exactly 6 digits"
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn danger" style={{ width: "100%", marginTop: "10px" }}>Verify & Login</button>
        </form>
      )}
    </div>
  );
}

export default AdminLogin;
