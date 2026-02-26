import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinGroup() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5055/join-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode, username })
    });

    const data = await response.json();

    navigate(`/group/${data._id}`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Join Group</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}

export default JoinGroup;