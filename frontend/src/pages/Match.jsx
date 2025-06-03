import { useState, useEffect } from "react";

function MatchPage() {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/match", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMatch(data);
    };

    fetchMatch();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Your Best Friend Match</h2>
      {match?.username ? (
        <div className="bg-green-100 p-4 rounded">
          <p><strong>Username:</strong> {match.username}</p>
          <p><strong>MBTI:</strong> {match.mbti}</p>
          <p><strong>Similarity:</strong> {match.score}%</p>
        </div>
      ) : (
        <p>{match?.msg || "Loading..."}</p>
      )}
    </div>
  );
}

export default MatchPage;
