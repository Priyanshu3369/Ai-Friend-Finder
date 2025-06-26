import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-800">AI Friend Finder</h1>
        <p className="text-lg mb-6 text-gray-700">Find meaningful AI-matched friendships</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
