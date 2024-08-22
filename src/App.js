import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import TextBoard from "./pages/TextBoard"
import FlagGamePage from "./pages/FlagGamePage"

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/textboard">Textboard</Link>
        <Link to="/flag-game">Flag Guessing Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/textboard" element={<TextBoard />} />
        <Route path="/flag-game" element={<FlagGamePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
