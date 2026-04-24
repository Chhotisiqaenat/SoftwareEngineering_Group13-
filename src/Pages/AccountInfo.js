import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountInfo() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // 🔐 Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      setMessage("Please login first.");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5055/user/${username}`
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          setMessage(data.message);
        }

      } catch (error) {
        setMessage("Cannot connect to server");
      }
    };

    fetchUser();
  }, [username]);

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5055/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage("✅ Password successfully changed!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage(data.message);
      }

    } catch (error) {
      setPasswordMessage("Server error.");
    }
  };

  if (!username) {
    return (
      <div style={styles.centerContainer}>
        <h3>Please login again.</h3>
        <button style={styles.primaryButton} onClick={() => navigate("/")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (message) {
    return <div style={styles.centerContainer}>{message}</div>;
  }

  if (!user) {
    return <div style={styles.centerContainer}>Loading user info...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Profile Section */}
        <div style={styles.headerSection}>
          <div style={styles.avatar}>
            {user.firstName?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ marginBottom: "5px" }}>
            {user.firstName} {user.lastName}
          </h2>
          <p style={styles.usernameText}>@{user.username}</p>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <span style={styles.label}>First Name</span>
            <span style={styles.value}>{user.firstName}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Last Name</span>
            <span style={styles.value}>{user.lastName}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{user.email}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Username</span>
            <span style={styles.value}>{user.username}</span>
          </div>
        </div>

        {/* 🔐 Change Password Section */}
        <div style={styles.passwordSection}>
          <h3>Change Password</h3>

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />

          <button
            style={styles.primaryButton}
            onClick={handleChangePassword}
          >
            Change Password
          </button>

          {passwordMessage && (
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              {passwordMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px"
  },
  centerContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  card: {
    width: "450px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: "40px"
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "30px"
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto 15px auto"
  },
  usernameText: {
    color: "#6b7280",
    fontSize: "14px"
  },
  infoSection: {
    marginTop: "20px"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb"
  },
  label: {
    fontWeight: "600",
    color: "#374151"
  },
  value: {
    color: "#111827"
  },
  passwordSection: {
    marginTop: "40px"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  primaryButton: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginTop: "5px"
  }
};

export default AccountInfo;