import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function CreateGroup() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");

  const addMember = () => {
    if (memberInput && !members.includes(memberInput)) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5055/create-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupName,
        username,
        members
      })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Project created successfully ✅");

      // After short delay, go back to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <Layout>
      <h2>Create New Project</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name</label>
          <br />
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <label>Add Members (username)</label>
          <br />
          <input
            type="text"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <button type="button" onClick={addMember}>
            Add
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          {members.map((member, index) => (
            <div key={index}>{member}</div>
          ))}
        </div>

        <button style={{ marginTop: "20px" }} type="submit">
          Done
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>{message}</p>
      )}
    </Layout>
  );
}

export default CreateGroup;