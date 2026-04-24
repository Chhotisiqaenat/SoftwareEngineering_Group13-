import React, { useEffect, useState } from "react";

function Dashboard() {
  const [weekDays, setWeekDays] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const [personalTodos, setPersonalTodos] = useState({});
  const [todoInputs, setTodoInputs] = useState({});

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // ================= DATE =================
  const normalizeDate = (date) => {
    if (!date) return null;

    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // ================= WEEK =================
  useEffect(() => {
    const today = new Date();

    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);

      days.push({
        date: normalizeDate(day),
        label: day.toLocaleDateString("en-US", {
          weekday: "short"
        })
      });
    }

    setWeekDays(days);

    loadAllData();
  }, []);

  const loadAllData = () => {
    // tasks
    const sprint =
      localStorage.getItem("sprintColumns");

    if (sprint) {
      const columns =
        JSON.parse(sprint);

      setTasks(
        Object.values(columns).flat()
      );
    }

    // meetings
    const savedMeetings =
      localStorage.getItem(
        "meetings"
      );

    if (savedMeetings) {
      setMeetings(
        JSON.parse(
          savedMeetings
        )
      );
    }

    // todos
    const savedTodos =
      localStorage.getItem(
        "dashboardTodos"
      );

    if (savedTodos) {
      setPersonalTodos(
        JSON.parse(savedTodos)
      );
    }
  };

  // ================= TODO =================
  const saveTodos = (data) => {
    setPersonalTodos(data);

    localStorage.setItem(
      "dashboardTodos",
      JSON.stringify(data)
    );
  };

  const addTodo = (date) => {
    const text =
      todoInputs[date];

    if (!text?.trim()) return;

    const updated = {
      ...personalTodos,
      [date]: [
        ...(personalTodos[
          date
        ] || []),
        {
          id: Date.now(),
          text
        }
      ]
    };

    saveTodos(updated);

    setTodoInputs({
      ...todoInputs,
      [date]: ""
    });
  };

  const deleteTodo = (
    date,
    id
  ) => {
    const updated = {
      ...personalTodos,
      [date]:
        personalTodos[
          date
        ].filter(
          (t) =>
            t.id !== id
        )
    };

    saveTodos(updated);
  };

  const startEditTodo = (
    id,
    text
  ) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const saveEditTodo = (
    date
  ) => {
    const updated = {
      ...personalTodos,
      [date]:
        personalTodos[
          date
        ].map(
          (todo) =>
            todo.id ===
            editingTodoId
              ? {
                  ...todo,
                  text: editingText
                }
              : todo
        )
    };

    saveTodos(updated);

    setEditingTodoId(null);
    setEditingText("");
  };

  // ================= FILTER =================
  const getTasksForDay = (
    date
  ) =>
    tasks.filter(
      (t) =>
        normalizeDate(
          t.dueDate
        ) === date
    );

  const getMeetingsForDay = (
    date
  ) =>
    meetings.filter(
      (m) =>
        normalizeDate(
          m.date
        ) === date
    );

  return (
    <div style={container}>
      <h2 style={title}>
        📅 My Schedule
      </h2>

      <div
        style={
          calendarWrapper
        }
      >
        {weekDays.map(
          (day) => {
            const tasks =
              getTasksForDay(
                day.date
              );

            const meetings =
              getMeetingsForDay(
                day.date
              );

            const todos =
              personalTodos[
                day.date
              ] || [];

            return (
              <div
                key={
                  day.date
                }
                style={
                  dayCard
                }
              >
                <h3>
                  {
                    day.label
                  }
                </h3>

                <p
                  style={
                    dateText
                  }
                >
                  {
                    day.date
                  }
                </p>

                {/* TASKS */}
                {tasks.map(
                  (
                    task
                  ) => (
                    <div
                      key={
                        task.id
                      }
                      style={
                        taskCard
                      }
                    >
                      📌{" "}
                      {
                        task.title
                      }
                    </div>
                  )
                )}

                {/* MEETINGS */}
                {meetings.map(
                  (
                    meet
                  ) => (
                    <div
                      key={
                        meet._id
                      }
                      style={
                        meetingCard
                      }
                    >
                      📅{" "}
                      {
                        meet.projectName
                      }

                      <div>
                        {
                          meet.title
                        }
                      </div>

                      <div>
                        🕙{" "}
                        {
                          meet.time
                        }
                      </div>
                    </div>
                  )
                )}

                {/* TODOS */}
                {todos.map(
                  (
                    todo
                  ) => (
                    <div
                      key={
                        todo.id
                      }
                      style={
                        todoCard
                      }
                    >
                      {editingTodoId ===
                      todo.id ? (
                        <>
                          <input
                            value={
                              editingText
                            }
                            onChange={(
                              e
                            ) =>
                              setEditingText(
                                e
                                  .target
                                  .value
                              )
                            }
                            style={
                              input
                            }
                          />

                          <button
                            onClick={() =>
                              saveEditTodo(
                                day.date
                              )
                            }
                            style={
                              smallBtn
                            }
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            🧾{" "}
                            {
                              todo.text
                            }
                          </span>

                          <div>
                            <button
                              onClick={() =>
                                startEditTodo(
                                  todo.id,
                                  todo.text
                                )
                              }
                              style={
                                smallBtn
                              }
                            >
                              ✏️
                            </button>

                            <button
                              onClick={() =>
                                deleteTodo(
                                  day.date,
                                  todo.id
                                )
                              }
                              style={
                                smallBtn
                              }
                            >
                              ❌
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                )}

                <input
                  placeholder="Add todo..."
                  value={
                    todoInputs[
                      day
                        .date
                    ] || ""
                  }
                  onChange={(
                    e
                  ) =>
                    setTodoInputs(
                      {
                        ...todoInputs,
                        [day.date]:
                          e
                            .target
                            .value
                      }
                    )
                  }
                  style={input}
                />

                <button
                  onClick={() =>
                    addTodo(
                      day.date
                    )
                  }
                  style={btn}
                >
                  + Add
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

/* ================= UI ================= */

const container = { padding: "20px" };
const title = { fontSize: "28px", marginBottom: "20px" };
const calendarWrapper = { display: "flex", gap: "16px", overflowX: "auto" };
const dayCard = {
  minWidth: "240px",
  background: "#fff",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 8px 18px rgba(0,0,0,.08)"
};
const dateText = { fontSize: "12px", color: "#64748b" };
const taskCard = { background: "#dbeafe", padding: "8px", marginTop: "8px", borderRadius: "8px" };
const meetingCard = { background: "#dcfce7", padding: "8px", marginTop: "8px", borderRadius: "8px" };
const todoCard = {
  background: "#fef9c3",
  padding: "8px",
  marginTop: "8px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between"
};
const input = { width: "100%", padding: "7px", marginTop: "8px" };
const btn = { width: "100%", marginTop: "6px", padding: "8px", background: "#2563eb", color: "white", border: "none" };
const smallBtn = { marginLeft: "4px", border: "none", cursor: "pointer" };

export default Dashboard;