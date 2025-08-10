import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glow Orb */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_#00ffb780,_transparent_70%)] blur-3xl z-0 animate-pulse" />
      <section className="relative z-10 text-center py-24 px-4">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_0_20px_#00ffb7] mb-4 animate-fade-in">
          Build Habits That Stick
        </h1>
        <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
          Track your daily routines and crush your goals with vibrant, intuitive
          tools.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-full bg-neon-purple text-black font-bold shadow-[0_0_15px_#a21caf] hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 rounded-full bg-neon-blue text-black font-bold shadow-[0_0_15px_#38bdf8] hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>
      {/* Feature Highlights */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-12">
        {[
          { title: "Daily Tracking", color: "text-neon-blue", icon: "🗓️" },
          { title: "Visual Streaks", color: "text-neon-pink", icon: "🔥" },
          { title: "Time Grouping", color: "text-neon-green", icon: "🕒" },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-[0_0_10px_#ffffff20] hover:shadow-[0_0_20px_#00ffb7] transition-all duration-300"
          >
            <div className={`text-4xl ${feature.color}`}>{feature.icon}</div>
            <h3 className={`mt-4 text-xl font-bold ${feature.color}`}>
              {feature.title}
            </h3>
          </div>
        ))}
      </section>
      {/* Inspirational Quote */}
      <section className="text-center py-10 text-white/80 italic z-10 relative">
        <p>
          
        </p>
      </section>
    </div>
  );
}
