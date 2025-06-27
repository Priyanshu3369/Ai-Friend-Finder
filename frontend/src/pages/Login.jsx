import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border mb-2" placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border mb-2" placeholder="Password" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
    </form>
  )
}
