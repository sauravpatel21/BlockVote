import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBlockVote } from "../context/BlockVoteContext";

function Navbar() {
  const { auth, logout } = useBlockVote();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.documentElement.classList.add("dark-mode");
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
      setIsDark(true);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" to="/">
          <span className="brand-badge"><span className="brand-mark">BV</span></span>
          <span>BlockVote</span>
        </Link>
        <nav className="nav">
          {!auth.token ? (
            <>
              <Link className="chip" to="/login">Login</Link>
              <Link className="chip primary" to="/signup">Create account</Link>
              <Link className="chip ghost" to="/admin-login">Admin</Link>
            </>
          ) : (
            <>
              <Link className="chip" to="/vote">Vote Dashboard</Link>
              {auth.user?.role === "admin" && (
                <Link className="chip ghost" to="/admin">Admin Panel</Link>
              )}
              <button className="chip ghost" onClick={logout}>Logout</button>
            </>
          )}
          <button className="chip" type="button" onClick={toggleDark} data-dark-toggle>
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
