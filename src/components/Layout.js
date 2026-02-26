import React from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2>Scheduler</h2>

          <div style={{ marginTop: "20px", cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}>
            My Schedule
          </div>

          <div style={{ cursor: "pointer" }}
            onClick={() => navigate("/account")}>
            Account Info
          </div>

          <div style={{ cursor: "pointer" }}
            onClick={() => navigate("/create-group")}>
            New Project
          </div>

          <div style={{ cursor: "pointer" }}
            onClick={() => navigate("/join-group")}>
            Join Project
          </div>

          <div style={{ cursor: "pointer" }}
            onClick={() => navigate("/meetings")}>
            Upcoming Meetings
          </div>

          <div style={{ cursor: "pointer" }}
            onClick={() => navigate("/alerts")}>
            Alerts
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#dc2626",
            border: "none",
            padding: "10px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", backgroundColor: "#f9fafb" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;