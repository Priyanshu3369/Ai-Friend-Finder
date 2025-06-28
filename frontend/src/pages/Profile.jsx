import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Profile() {
  const [form, setForm] = useState({ interests: [], personality: '', mood: '' })

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setForm(res.data)
    })
  }, [])

  const update = async () => {
    await axios.post('http://localhost:5000/api/users/update', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    alert('Profile updated')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Update Profile</h2>
      <input className="border p-2 w-full mb-2" placeholder="Mood" value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Personality" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Interests (comma separated)" value={form.interests.join(',')} onChange={e => setForm({ ...form, interests: e.target.value.split(',') })} />
      <button onClick={update} className="bg-blue-500 text-white px-4 py-2">Save</button>
    </div>
  )
}
