import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/auth/register", form);
      setSuccess("User registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a1d] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-neon-pink mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-[#2a2a2d] text-white border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-[#2a2a2d] text-white border border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-[#2a2a2d] text-white border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-neon-pink text-black font-bold hover:brightness-110 transition"
          >
            Register
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-400 text-center">{success}</p>
        )}
      </div>
    </div>
  );
}
