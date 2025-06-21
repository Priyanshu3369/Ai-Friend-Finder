import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    interests: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/register", form);
      alert("Registration successful!");
    } catch (err) {
      alert("Registration failed! Try a different email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <Card className="backdrop-blur bg-white/10 border border-white/20 p-6 rounded-xl shadow-lg max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <Input name="interests" placeholder="Interests (comma-separated)" value={form.interests} onChange={handleChange} />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
