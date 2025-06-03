import { useState } from "react";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.msg || data.detail);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
        <input className="input mt-2" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn mt-4">Register</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

export default Register;
