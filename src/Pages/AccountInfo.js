import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountInfo.css";

function AccountInfo() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setError("No user logged in. Please login again.");
      return;
    }

    fetch("http://localhost:5055/user/" + username)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user information.");
      });

  }, []);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    const username = localStorage.getItem("username");

    try {
      const response = await fetch("http://localhost:5055/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password updated successfully!");
        setNewPassword("");
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Error updating password.");
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Return to Login</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Account Information</h2>

        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handlePasswordChange}
          style={styles.button}
        >
          Update Password
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f9"
  },
  card: {
    width: "400px",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2c7be5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold"
  }
};

export default AccountInfo;
