import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-neutral-900 text-white shadow-md">
      <div className="text-xl font-bold text-blue-300">HabitTrack</div>
      <div className="space-x-6">
        <Link to="/" className="hover:text-neon-blue">
          Home
        </Link>
        <Link to="/about" className="hover:text-neon-blue">
          About
        </Link>
        <Link to="/dashboard" className="hover:text-neon-blue">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
