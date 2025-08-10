import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HabitLogs() {
  const { habitId } = useParams();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabit = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/habits/${habitId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch habit: ${res.status}`);
        }

        const data = await res.json();
        setHabit(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load habit logs:", err);
        alert("Error loading habit");
        navigate("/dashboard");
      }
    };

    fetchHabit();
  }, [habitId, navigate]);

  const getLast30Days = () => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      return date.toDateString();
    });
  };

  const checkIfDone = (dateStr) => {
    return habit.logs.some(
      (log) => new Date(log.date).toDateString() === dateStr
    );
  };

  const calculateStreaks = () => {
    const days = getLast30Days();
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    for (let i = days.length - 1; i >= 0; i--) {
      if (checkIfDone(days[i])) {
        streak++;
        if (i === days.length - 1) currentStreak = streak;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        if (i === days.length - 1) currentStreak = 0;
        streak = 0;
      }
    }

    return { currentStreak, longestStreak };
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  const { currentStreak, longestStreak } = calculateStreaks();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white min-h-screen">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-sm text-neon-green transition duration-200"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-2 text-neon-pink">
        {habit.name} — Habit Tracker
      </h1>

      <div className="mb-6 text-sm text-gray-400 flex flex-col sm:flex-row gap-2 sm:items-center">
        <span className="text-neon-yellow font-semibold">
          Current Streak: {currentStreak} days
        </span>
        <span className="text-neon-blue font-semibold">
          Longest Streak: {longestStreak} days
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
        {getLast30Days().map((dateStr, index) => {
          const isToday =
            new Date(dateStr).toDateString() === new Date().toDateString();
          const isDone = checkIfDone(dateStr);
          return (
            <button
              key={index}
              onClick={() => console.log("Clicked", dateStr)}
              title={dateStr}
              className={`relative group w-12 h-12 flex items-center justify-center rounded-xl text-sm transition-all duration-300 ease-in-out
    ${
      isDone
        ? "bg-neon-green text-black font-bold"
        : "bg-neutral-800 text-gray-500"
    }
    ${isToday ? "ring-2 ring-neon-pink animate-pulse" : ""}
    hover:scale-110 hover:shadow-neon
  `}
            >
              {new Date(dateStr).getDate()}
              <span
                className={`absolute top-0 right-0 text-xs ${
                  isDone ? "text-green-300" : "text-red-500"
                } group-hover:scale-125 transition-transform duration-200`}
              >
                {isDone ? "✅" : "❌"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-gray-400 text-sm italic">
        Hover a box to see the date. Green = completed. Pink ring = today.
      </p>
    </div>
  );
}
