import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center text-white">
      <h1 className="text-4xl text-neon-red mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-neon-blue underline">
        Go back home
      </Link>
    </div>
  );
}
