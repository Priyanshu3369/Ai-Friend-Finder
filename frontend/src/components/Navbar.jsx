import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">AI Friend Finder</Link>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/users">Users</Link>
            <Link to="/friends">Friends</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
