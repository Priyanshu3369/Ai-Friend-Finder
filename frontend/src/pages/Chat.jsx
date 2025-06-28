import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

export default function Chat() {
  const { friendId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    socket.emit('join', { user1: userId, user2: friendId })

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off('receive_message')
    }
  }, [friendId, userId])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const msg = {
      sender_id: userId,
      receiver_id: friendId,
      message: newMessage
    }

    socket.emit('send_message', msg)
    setMessages(prev => [...prev, msg])
    setNewMessage('')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="border h-64 overflow-y-auto mb-4 p-2 bg-gray-100 rounded">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 ${m.sender_id === userId ? 'text-right' : 'text-left'}`}>
            <span className="bg-white p-2 rounded shadow">{m.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  )
}
