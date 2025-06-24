import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
import Suggestions from "./pages/Suggestions";
import FriendRequests from "./pages/FriendRequests";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/requests" element={<FriendRequests />} />
        <Route path="/chat" element={<Chat userEmail="a@example.com" friendEmail="b@example.com" />} />
      </Routes>
    </Router>
  );
}

export default App;
