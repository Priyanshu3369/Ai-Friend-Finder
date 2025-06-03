import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import InputPage from "./pages/Input";
import Navbar from "./components/Navbar";
import MatchPage from "./pages/Match";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/match" element={<MatchPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
