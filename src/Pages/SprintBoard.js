import React, { useState, useEffect } from "react";

function SprintBoard({ groupId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5055/tasks/${groupId}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    await fetch("http://localhost:5055/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, title })
    });
    setTitle("");
    fetchTasks();
  };

  const moveTask = async (taskId, status) => {
    await fetch("http://localhost:5055/update-task-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, status })
    });
    fetchTasks();
  };

  const renderColumn = (status) => (
    <div style={{ width: "30%" }}>
      <h3>{status}</h3>
      {tasks.filter(t => t.status === status).map(task => (
        <div key={task._id} style={{ padding: "10px", background: "#fff", marginBottom: "10px" }}>
          {task.title}
          <div>
            {status !== "backlog" && (
              <button onClick={() => moveTask(task._id, "backlog")}>←</button>
            )}
            {status !== "done" && (
              <button onClick={() => moveTask(task._id, "done")}>→</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={createTask}>Add</button>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        {renderColumn("backlog")}
        {renderColumn("in-progress")}
        {renderColumn("done")}
      </div>
    </div>
  );
}

export default SprintBoard;