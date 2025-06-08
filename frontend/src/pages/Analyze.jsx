import { useState } from "react";

function Analyze() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/nlp/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Upload Your Text</h2>
      <textarea
        rows="8"
        className="w-full p-3 border rounded mb-4"
        placeholder="Paste your writing here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={handleAnalyze} className="btn" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Results:</h3>
          <p><strong>Emotion:</strong> {result.emotion.label} ({(result.emotion.score * 100).toFixed(2)}%)</p>
          <p><strong>MBTI Summary:</strong> {result.mbti.summary}</p>
          <ul className="mt-2 list-disc list-inside">
            {Object.entries(result.mbti.traits).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Analyze;
