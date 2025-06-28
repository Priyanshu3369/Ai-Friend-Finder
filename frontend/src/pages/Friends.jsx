import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Friends() {
  const [friends, setFriends] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:5000/api/users/friends', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setFriends(res.data)
    }).catch(err => {
      console.error('Failed to fetch friends:', err)
    })
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p>No friends yet. Send and accept friend requests!</p>
      ) : (
        friends.map(friend => (
          <div key={friend._id} className="border p-4 rounded mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">{friend.email}</p>
              <p className="text-sm">Mood: {friend.mood}</p>
              <p className="text-sm">Interests: {friend.interests}</p>
            </div>
            <button
              onClick={() => navigate(`/chat/${friend._id}`)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Chat
            </button>
          </div>
        ))
      )}
    </div>
  )
}
