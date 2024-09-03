import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import TextBoard from "./pages/TextBoard"
import FlagGamePage from "./pages/FlagGamePage"
import GraphGamePage from "./pages/GraphGamePage"
import PhaserGame from "./phaser-game/PhaserGame"


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/textboard">Textboard</Link>
        <Link to="/flag-game">Flag Guessing Game</Link>
        <Link to="/graph-game">Graph Game</Link>
        <Link to="/phaser-game">Phaser Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/textboard" element={<TextBoard />} />
        <Route path="/flag-game" element={<FlagGamePage/>} />
        <Route path="/graph-game" element={<GraphGamePage/>} />
        <Route path="/phaser-game" element={<PhaserGame/>} />
      </Routes>
    </Router>
  );
}

export default App;
