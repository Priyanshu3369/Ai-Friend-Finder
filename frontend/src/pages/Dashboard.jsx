import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {user.name || "Friend"} 👋</h1>
      <p className="text-gray-600 mt-2">This is your Dashboard. More features coming soon!</p>
    </div>
  );
}

export default Dashboard;
