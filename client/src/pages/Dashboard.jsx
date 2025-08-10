import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("morning");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabits = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch habits");

        const data = await res.json();
        setHabits(data);
      } catch (err) {
        console.error("Error loading habits:", err);
        alert("Failed to load habits");
      }
    };

    fetchHabits();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const addHabit = async () => {
    if (newHabit.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newHabit,
          timeOfDay,
        }),
      });

      if (!res.ok) throw new Error("Failed to add habit");

      const data = await res.json();

      setHabits([...habits, data]);
      setNewHabit("");
      setTimeOfDay("morning");
    } catch (err) {
      console.error("Add habit error:", err);
      try {
        const errorText = await res.text();
        console.error("Server response:", errorText);
      } catch {}
      alert("Error adding habit");
    }
  };

  const markHabitDone = async (habitId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/habits/${habitId}/done`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to toggle completion");

      const updated = await res.json();
      setHabits(habits.map((h) => (h._id === habitId ? updated : h)));
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update habit");
    }
  };

  const grouped = habits.reduce((acc, habit) => {
    const key = habit.timeOfDay || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(habit);
    return acc;
  }, {});

  const colors = {
    morning: "bg-yellow-600",
    afternoon: "bg-orange-600",
    evening: "bg-purple-700",
    night: "bg-blue-800",
  };

  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }

  function getStreakCount(logs) {
    const dates = new Set(logs.map((l) => new Date(l.date).toDateString()));
    let streak = 0;
    for (let i = 0; i < 100; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (dates.has(d.toDateString())) {
        streak++;
      } else {
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  }

  return (
    <>
      {/* Blurred animated glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] animate-gradient-glow blur-3xl opacity-30 z-0" />

      {/* Main UI content (z-10) */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-neon-green">Habit Tracker</h1>
          <h5 className="text-xl font-bold text-violet-400">
            Keep a track of your habits effortlessly!
          </h5>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow-md"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit"
            className="flex-grow p-2 rounded bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neon-green"
          />
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="p-2 rounded bg-neutral-900 border border-neutral-700 text-white"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <button
            onClick={addHabit}
            className="bg-indigo-400 text-black px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 ease-in-out hover:scale-125"
          >
            Add
          </button>
        </div>

        {Object.keys(grouped).map((time) => (
          <div key={time} className="mb-6">
            <h2
              className={`text-xl font-bold capitalize mb-2 tracking-wide text-white drop-shadow-[0_0_5px] ${colors[time]}`}
            >
              {time}
            </h2>
            <ul className="space-y-3">
              {grouped[time].map((habit) => (
                <li
                  key={habit._id}
                  className={`flex items-center justify-between p-3 rounded-lg bg-neutral-800 border border-neutral-700 shadow-lg hover:shadow-neon transition duration-300 ease-in-out hover:scale-105`}
                >
                  <div className="flex flex-col">
                    <Link
                      to={`/habits/${habit._id}/logs`}
                      className={`transition duration-300 transform hover:scale-105 hover:text-neon-blue ${
                        habit.completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }`}
                    >
                      {habit.name}
                    </Link>

                    <p className="text-xs text-gray-400 mb-1">
                      Last done:{" "}
                      {habit.logs?.length > 0
                        ? new Date(
                            habit.logs[habit.logs.length - 1].date
                          ).toLocaleDateString()
                        : "Never"}
                    </p>

                    {habit.logs && (
                      <>
                        <p className="text-xs text-neon-green font-semibold">
                          🔥 {getStreakCount(habit.logs)}-day streak
                        </p>
                        <div className="flex gap-1 mt-1">
                          {getLast7Days().map((day) => {
                            const completed = habit.logs.some(
                              (log) =>
                                new Date(log.date).toDateString() ===
                                day.toDateString()
                            );
                            return (
                              <div
                                key={day.toDateString()}
                                className={`w-3 h-3 rounded-full ${
                                  completed ? "bg-lime-400" : "bg-neutral-700"
                                }`}
                                title={day.toLocaleDateString()}
                              ></div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => markHabitDone(habit._id)}
                    className={`px-3 py-1 rounded text-sm font-bold shadow-md ${
                      habit.logs?.some(
                        (log) =>
                          new Date(log.date).toDateString() ===
                          new Date().toDateString()
                      )
                        ? "bg-neutral-900 text-neon-green"
                        : "bg-neon-green text-black"
                    } hover:opacity-90`}
                  >
                    ✅ Done
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
