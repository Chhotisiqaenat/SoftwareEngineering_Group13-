import React from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  const menuItemStyle = {
    cursor: "pointer",
    marginBottom: "22px",
    fontSize: "15px"
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2 style={{ marginBottom: "40px" }}>Scheduler</h2>

          <div
            style={menuItemStyle}
            onClick={() => navigate("/account")}
          >
            Account Info
          </div>

          <div
            style={menuItemStyle}
            onClick={() => navigate("/create-group")}
          >
            New Project
          </div>

          <div
            style={menuItemStyle}
            onClick={() => navigate("/join-group")}
          >
            Join Project
          </div>

          <div
            style={menuItemStyle}
            onClick={() => navigate("/dashboard")}
          >
            My Schedule
          </div>

          <div
            style={menuItemStyle}
            onClick={() => navigate("/meetings")}
          >
            Upcoming Meetings
          </div>

          <div
            style={{ ...menuItemStyle, marginBottom: "0px" }}
            onClick={() => navigate("/alerts")}
          >
            Alerts
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            backgroundColor: "#dc2626",
            border: "none",
            padding: "12px",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px"
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