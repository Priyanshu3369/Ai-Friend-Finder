import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex gap-6">
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/input">Input</Link>
      </div>
    </nav>
  );
}

export default Navbar;
