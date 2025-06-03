import { useState } from "react";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setMessage("Login successful!");
    } else {
      setMessage(data.detail);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input className="input" placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
        <input className="input mt-2" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn mt-4">Login</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

export default Login;
