import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [sentRequests, setSentRequests] = useState({}); // track requests

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/v1/suggestions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Suggestions received:", res.data);  // 👈 check this
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();
  }, []);


  const sendFriendRequest = async (receiverEmail) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/v1/send-request",
        { receiver_email: receiverEmail },  // ✅ must match Pydantic model
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Friend request sent:", res.data);
    } catch (err) {
      console.error("Error sending request:", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Friend request failed.");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-white px-4 py-10">
      <h2 className="text-3xl mb-6 text-center">Suggested Friends</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((user, idx) => (
          <Card key={idx} className="bg-white/10 border border-white/20 p-4 rounded-xl shadow-xl">
            <CardHeader>
              <CardTitle>{user.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Interests: {user.interests}</p>
              <p className="text-sm mb-2">Match Score: {user.similarity}</p>
              <Button className="w-full" onClick={() => sendFriendRequest(user.email)}>
                Send Friend Request
              </Button>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
