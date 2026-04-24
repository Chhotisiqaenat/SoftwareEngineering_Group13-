import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5055/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("User found. (Reset flow coming next)");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Forgot Password</h2>

        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button}>Submit</button>
        </form>

        <button
          style={styles.secondary}
          onClick={() => navigate("/")}
        >
          Return to Login
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9"
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2c7be5",
    color: "white",
    border: "none"
  },
  secondary: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#6c757d",
    color: "white",
    border: "none"
  }
};

export default ForgotPassword;
