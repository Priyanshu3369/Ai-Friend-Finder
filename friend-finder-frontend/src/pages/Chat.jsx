import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CryptoJS from "crypto-js";

const SECRET_KEY = "my_shared_secret"; // Later: generate per friend securely

export default function Chat({ userEmail, friendEmail }) {
  const [ws, setWs] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef();

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${userEmail}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const decrypted = CryptoJS.AES.decrypt(data.encrypted_text, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setMessages((prev) => [...prev, { sender: data.sender, text: decrypted }]);
    };
    setWs(socket);
    return () => socket.close();
  }, [userEmail]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/history?user1=${userEmail}&user2=${friendEmail}`);
      const history = await res.json();
      const decrypted = history.map((msg) => ({
        sender: msg.sender === userEmail ? "You" : msg.sender,
        text: CryptoJS.AES.decrypt(msg.encrypted_text, SECRET_KEY).toString(CryptoJS.enc.Utf8),
        timestamp: msg.timestamp
      }));
      setMessages(decrypted);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const sendMessage = () => {
    const encrypted = CryptoJS.AES.encrypt(input, SECRET_KEY).toString();
    ws.send(JSON.stringify({
      sender: userEmail,
      receiver: friendEmail,
      encrypted_text: encrypted
    }));
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setInput("");
  };

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-4">
      <h2 className="text-2xl mb-4 text-center">Chat with {friendEmail}</h2>
      <div className="max-w-2xl mx-auto border border-white/20 rounded-xl p-4 bg-white/10 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 px-4 rounded-lg max-w-xs break-words ${
                msg.sender === "You"
                  ? "bg-blue-500 self-end text-right"
                  : "bg-gray-700 self-start text-left"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          <div ref={chatBoxRef}></div>
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
