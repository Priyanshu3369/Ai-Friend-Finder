import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/v1/incoming-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/v1/accept-request", {
        receiver_email: email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Friend request accepted!");
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-10 px-4">
      <h2 className="text-3xl mb-6 text-center">Incoming Friend Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center">No pending requests</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {requests.map((req, i) => (
            <Card key={i} className="bg-white/10 border border-white/20 p-4 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle>{req.sender_email}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => acceptRequest(req.sender_email)} className="w-full">
                  Accept
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
