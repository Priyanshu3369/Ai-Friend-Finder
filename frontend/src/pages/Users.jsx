import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/match-scores', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      // Sort users by match_score descending
      const sorted = res.data.sort((a, b) => b.match_score - a.match_score)
      setUsers(sorted)
    }).catch(err => {
      console.error('Error fetching match scores:', err)
    })
  }, [])

  const sendRequest = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/send-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      alert("Request sent")
    } catch (err) {
      alert("Failed to send request")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Other Users</h2>
      {users.map(({ user, match_score }) => (
        <div key={user._id} className="mb-4 border p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{user.email}</p>
              <p className="text-sm">Mood: {user.mood || 'N/A'} | Personality: {user.personality || 'N/A'}</p>
              <p className="text-sm mb-1">Interests: {user.interests || 'None'}</p>
              <p className="text-green-600 font-semibold">
                Match Score: {match_score}% {match_score > 70 && <span className="text-red-500">🔥 Best Match</span>}
              </p>
            </div>
            <button
              onClick={() => sendRequest(user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Send Request
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
