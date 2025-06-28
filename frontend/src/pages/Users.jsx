import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setUsers(res.data))
  }, [])

  const sendRequest = async (id) => {
    await axios.post(`http://localhost:5000/api/users/send-request/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    alert("Request sent")
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Other Users</h2>
      {users.map(user => (
        <div key={user._id} className="mb-2 flex justify-between border p-2">
          <span>{user.email}</span>
          <button className="bg-green-500 text-white px-2 py-1" onClick={() => sendRequest(user._id)}>Send Request</button>
        </div>
      ))}
    </div>
  )
}
