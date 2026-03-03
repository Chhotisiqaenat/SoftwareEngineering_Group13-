import React, { useState } from "react";

function CreateGroup({ refreshProjects }) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");

  const searchUsers = async (value) => {
    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5055/search-users?query=${value}`
      );

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const addMember = (user) => {
    if (!members.find((m) => m._id === user._id)) {
      setMembers([...members, user]);
    }
  };

  const removeMember = (userId) => {
    setMembers(members.filter((m) => m._id !== userId));
  };

  const handleCreate = async () => {
    if (!groupName) {
      setMessage("Please enter a project name.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5055/create-group",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupName,
            members: members.map((m) => m._id),
            username: localStorage.getItem("username")
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Project successfully created!");

        // 🔥 THIS updates sidebar instantly
        if (refreshProjects) {
          refreshProjects();
        }

        // Clear form
        setGroupName("");
        setSearchQuery("");
        setSearchResults([]);
        setMembers([]);

      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create New Project</h2>

      <input
        type="text"
        placeholder="Project Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        style={styles.input}
      />

      <input
        type="text"
        placeholder="Search username..."
        value={searchQuery}
        onChange={(e) => searchUsers(e.target.value)}
        style={styles.input}
      />

      {searchResults.map((user) => (
        <div key={user._id} style={styles.searchResult}>
          {user.username}
          <button
            style={styles.addButton}
            onClick={() => addMember(user)}
          >
            Add
          </button>
        </div>
      ))}

      <h4>Members:</h4>
      {members.map((member) => (
        <div key={member._id} style={styles.memberRow}>
          {member.username}
          <button
            style={styles.removeButton}
            onClick={() => removeMember(member._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={handleCreate} style={styles.primaryButton}>
        Create Project
      </button>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  input: {
    display: "block",
    margin: "15px 0",
    padding: "10px",
    width: "300px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  searchResult: { marginBottom: "10px" },
  memberRow: { marginBottom: "8px" },
  addButton: { marginLeft: "10px", cursor: "pointer" },
  removeButton: { marginLeft: "10px", cursor: "pointer", color: "red" },
  primaryButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default CreateGroup;