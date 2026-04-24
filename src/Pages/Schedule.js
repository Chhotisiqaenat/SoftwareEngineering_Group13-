import React, { useState } from "react";

function Schedule({ sprintTasks = [] }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // =========================
  // ADD PERSONAL TODO
  // =========================
  const addTodo = () => {
    if (!input.trim()) return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "todo",
        title: input,
        date: new Date().toISOString().split("T")[0]
      }
    ]);

    setInput("");
  };

  // =========================
  // MERGE ALL SCHEDULE ITEMS
  // =========================
  const scheduleItems = [
    ...sprintTasks,
    ...todos
  ];

  // sort by date
  scheduleItems.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        📅 My Schedule
      </h2>

      {/* =========================
          TODO INPUT SECTION
      ========================= */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a daily to-do..."
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px"
          }}
        />

        <button onClick={addTodo} style={{ padding: "10px" }}>
          Add
        </button>
      </div>

      {/* =========================
          SCHEDULE LIST
      ========================= */}
      {scheduleItems.length === 0 ? (
        <p>No scheduled items</p>
      ) : (
        scheduleItems.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background:
                item.type === "task"
                  ? "#f8fafc"
                  : "#fff7ed"
            }}
          >
            <strong>{item.title}</strong>

            <p style={{ fontSize: "12px", color: "gray" }}>
              📅 {item.date} • {item.type}
              {item.priority ? ` • ${item.priority}` : ""}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Schedule;