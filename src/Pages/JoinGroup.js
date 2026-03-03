import React, { useState } from "react";

function JoinGroup() {
  const username = localStorage.getItem("username");

  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    if (!inviteCode) {
      setMessage("Please enter an invite code.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5055/join-group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inviteCode,
            username
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Successfully joined project!");
        setInviteCode("");

        // refresh page so sidebar updates
        window.location.reload();
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Server error.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Join Project</h2>

        <input
          type="text"
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleJoin} style={styles.button}>
          Join
        </button>

        {message && (
          <p style={{ marginTop: "15px", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh"
  },
  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default JoinGroup;