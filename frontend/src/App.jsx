import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlockVoteProvider } from "./context/BlockVoteContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Vote from "./pages/Vote";

function App() {
  return (
    <Router>
      <BlockVoteProvider>
        <div className="app">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/vote" element={<Vote />} />
            </Routes>
          </main>
        </div>
      </BlockVoteProvider>
    </Router>
  );
}

export default App;
