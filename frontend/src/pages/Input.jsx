import { useState } from "react";

function InputPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setResult(data.traits);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Submit Writing Sample</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input h-40"
          placeholder="Type something about yourself..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="btn mt-4">Analyze</button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Detected Traits</h3>
          <p><strong>MBTI:</strong> {result.MBTI}</p>
          <ul className="mt-2 list-disc list-inside">
            {Object.entries(result.BigFive).map(([k, v]) => (
              <li key={k}><strong>{k}:</strong> {(v * 100).toFixed(1)}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InputPage;
