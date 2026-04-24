import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "./TaskModal";

const initialData = {
  backlog: [],
  inProgress: [],
  review: [],
  complete: []
};

function SprintBoard({ members = [] }) {
  // =========================
  // LOCAL STORAGE LOAD FIX
  // =========================
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("sprintColumns");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [showModal, setShowModal] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);

  // =========================
  // PERSISTENCE SAVE FIX
  // =========================
  useEffect(() => {
    localStorage.setItem("sprintColumns", JSON.stringify(columns));
  }, [columns]);

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const openModal = (column) => {
    setCurrentColumn(column);
    setShowModal(true);
  };

  // =========================
  // ADD TASK
  // =========================
  const addTask = (task) => {
    setColumns((prev) => ({
      ...prev,
      [currentColumn]: [
        ...prev[currentColumn],
        {
          ...task,
          id: Date.now().toString()
        }
      ]
    }));

    setShowModal(false);
  };

  // =========================
  // DELETE TASK
  // =========================
  const handleDelete = (taskId, column) => {
    setColumns((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId)
    }));
  };

  // =========================
  // DRAG & DROP
  // =========================
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    const sourceItems = Array.from(columns[sourceCol]);
    const [movedItem] = sourceItems.splice(result.source.index, 1);

    const destItems = Array.from(columns[destCol]);
    destItems.splice(result.destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [sourceCol]: sourceItems,
      [destCol]: destItems
    });
  };

  // =========================
  // COLUMN TITLE
  // =========================
  const getColumnTitle = (key) => {
    if (key === "inProgress") return "In Progress";
    if (key === "complete") return "Complete";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  // =========================
  // SCHEDULE EXPORT (USED BY DASHBOARD)
  // =========================
  const getUpcomingTasks = () => {
    const allTasks = Object.values(columns).flat();

    return allTasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.id,
        type: "task",
        title: task.title,
        date: task.dueDate,
        priority: task.priority
      }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Project Sprint Board
      </h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          {Object.keys(columns).map((colKey) => (
            <Droppable droppableId={colKey} key={colKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={columnStyle}
                >
                  <h3>{getColumnTitle(colKey)}</h3>

                  <button onClick={() => openModal(colKey)} style={addBtn}>
                    + Add Task
                  </button>

                  {columns[colKey].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...taskCard,
                            borderLeft: `5px solid ${
                              task.priority === "High"
                                ? "red"
                                : task.priority === "Medium"
                                ? "orange"
                                : "green"
                            }`,
                            ...provided.draggableProps.style
                          }}
                        >
                          <strong>{task.title}</strong>

                          <p style={smallText}>{task.category}</p>

                          <p style={{ fontWeight: "bold" }}>
                            {task.priority}
                          </p>

                          <p style={smallText}>
                            Created by: {task.createdBy?.username || "Unknown"}
                          </p>

                          <p style={smallText}>
                            Assigned to: {task.assignedTo?.username || "Unassigned"}
                          </p>

                          <p style={smallText}>
                            📅 Due:{" "}
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "Not set"}
                          </p>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(task.id, colKey)}
                            style={{
                              marginTop: "8px",
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "6px"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* =========================
          MODAL
      ========================= */}
      {showModal && (
        <TaskModal
          members={members}
          onClose={() => setShowModal(false)}
          onCreate={addTask}
        />
      )}
    </div>
  );
}

export default SprintBoard;

/* ================= STYLES ================= */

const columnStyle = {
  width: "270px",
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const addBtn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginBottom: "15px"
};

const taskCard = {
  padding: "14px",
  marginBottom: "12px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.08)"
};

const smallText = {
  fontSize: "11px",
  color: "gray",
  margin: "4px 0"
};