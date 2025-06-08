import { useEffect, useState } from "react";

function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/match/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setMatches)
      .catch(() => alert("Match fetch failed"));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Your Best Matches</h2>
      {matches.length === 0 ? (
        <p>No matches found. Upload your text first.</p>
      ) : (
        <div className="grid gap-4">
          {matches.map((match, idx) => (
            <div key={idx} className="p-4 border rounded shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold">{match.name}</h3>
              <p>MBTI: {match.mbti}</p>
              <p>Emotion: {match.emotion}</p>
              <p className="font-bold">Compatibility: {match.score}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
