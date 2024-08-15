import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import TextBoard from "./pages/TextBoard"
import FlagGamePage from "./pages/FlagGamePage"


function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>Supa Smoothies</h1>
        <Link to="/">Home</Link>
        <Link to="/create">Create New Smoothie</Link>
        <Link to="/textboard">Textboard</Link>
        <Link to="/flag-game">Flag Guessing Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/textboard" element={<TextBoard />} />
        <Route path="/flag-game" element={<FlagGamePage/>} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
