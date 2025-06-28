import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Friends() {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/friends', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setFriends(res.data))
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.map(f => (
        <div key={f._id} className="p-2 border mb-2">{f.email}</div>
      ))}
    </div>
  )
}
