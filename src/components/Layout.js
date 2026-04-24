import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [projects, setProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `http://localhost:5055/get-user-groups/${username}`
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }

    } catch {
      setProjects([]);
    }
  }, [username]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (projectId) => {
    await fetch(
      `http://localhost:5055/delete-group/${projectId}`,
      { method: "DELETE" }
    );
    fetchProjects();
  };

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  const menuItemStyle = {
    cursor: "pointer",
    marginBottom: "24px",
    fontSize: "15px"
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "260px",
        backgroundColor: "#111827",
        color: "white",
        padding: "40px 25px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>

        <div>
          <h2 style={{ marginBottom: "40px" }}>Scheduler</h2>

          <div style={menuItemStyle} onClick={() => navigate("/account")}>
            Account Info
          </div>

          <div style={menuItemStyle} onClick={() => navigate("/create-group")}>
            New Project
          </div>

          <div style={menuItemStyle} onClick={() => navigate("/join-group")}>
            Join Project
          </div>

          <div
            style={{ ...menuItemStyle, marginBottom: "10px" }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            My Current Projects {showDropdown ? "▴" : "▾"}
          </div>

          {showDropdown && (
            <div style={{ marginLeft: "15px", marginBottom: "25px" }}>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "14px",
                      color: "#d1d5db"
                    }}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/group/${project._id}`)}
                    >
                      {project.name}
                    </span>

                    <span
                      style={{ cursor: "pointer", color: "#ef4444" }}
                      onClick={() => deleteProject(project._id)}
                    >
                      ✕
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                  No projects yet
                </div>
              )}
            </div>
          )}

          <div style={menuItemStyle} onClick={() => navigate("/dashboard")}>
            My Schedule
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#dc2626",
            border: "none",
            padding: "12px",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "40px",
        backgroundColor: "#f9fafb",
        overflowY: "auto"
      }}>
        <Outlet context={{ refreshProjects: fetchProjects }} />
      </div>
    </div>
  );
}

export default Layout;