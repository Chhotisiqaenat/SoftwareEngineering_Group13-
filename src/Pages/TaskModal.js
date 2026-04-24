import React, { useState } from "react";

function TaskModal({
  onClose,
  onCreate,
  members = [],
  initialData,
  onUpdate
}) {
  // =========================
  // FORM STATE (CREATE + EDIT)
  // =========================
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [createdBy, setCreatedBy] = useState(initialData?.createdBy || "");
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleSubmit = () => {
    if (!title.trim()) return;

    const payload = {
      title,
      category,
      priority,
      createdBy,
      assignedTo,
      description,
      dueDate
    };

    if (initialData) {
      onUpdate(payload); // EDIT MODE
    } else {
      onCreate(payload); // CREATE MODE
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h1 style={heading}>
          {initialData ? "Edit Task" : "Create Task"}
        </h1>

        {/* TITLE */}
        <input
          style={input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY */}
        <input
          style={input}
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* PRIORITY */}
        <select
          style={input}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* CREATED BY */}
        <select
          style={input}
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        >
          <option value="">Select Creator</option>
          {members.map((member) => (
            <option key={member._id} value={member.username}>
              {member.username}
            </option>
          ))}
        </select>

        {/* ASSIGNED TO */}
        <select
          style={input}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign To</option>
          {members.map((member) => (
            <option key={member._id} value={member.username}>
              {member.username}
            </option>
          ))}
        </select>

        {/* ✅ DUE DATE (NEW FEATURE) */}
        <input
          style={input}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          style={textarea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* BUTTONS */}
        <div style={buttonRow}>
          <button style={createBtn} onClick={handleSubmit}>
            {initialData ? "Update" : "Create"}
          </button>

          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;

/* =========================
   STYLES (REQUIRED - FIXES ERROR)
   ========================= */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modal = {
  width: "720px",
  background: "white",
  borderRadius: "18px",
  padding: "40px"
};

const heading = {
  fontSize: "42px",
  marginBottom: "25px"
};

const input = {
  width: "100%",
  padding: "18px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "18px"
};

const textarea = {
  width: "100%",
  height: "110px",
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "18px",
  resize: "none",
  marginBottom: "18px"
};

const buttonRow = {
  display: "flex",
  gap: "15px"
};

const createBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "14px 26px",
  borderRadius: "10px",
  fontSize: "18px",
  cursor: "pointer"
};

const cancelBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "14px 26px",
  borderRadius: "10px",
  fontSize: "18px",
  cursor: "pointer"
};