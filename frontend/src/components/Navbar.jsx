import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <Link to="/" className="font-bold text-lg">FriendFinder</Link>
      <div>
        {token ? (
          <>
            <Link to="/dashboard" className="mr-4">Dashboard</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <Link to="/users" className="mr-4">Find Friends</Link>
            <Link to="/friends" className="mr-4">Friends</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
