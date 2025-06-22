import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/v1/suggestions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, []);

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
              <Button className="w-full">Send Friend Request</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
