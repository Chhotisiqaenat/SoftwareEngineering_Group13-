import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ScheduleMatching from "./ScheduleMatching";
import SprintBoard from "./SprintBoard";
import ScheduleMeeting from "./ScheduleMeeting";
import GroupChat from "./GroupChat";

function GroupPage() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:5055/group/${groupId}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (!group) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <div style={pageContainer}>
      
      {/* HEADER */}
      <div style={headerCard}>
        <h1 style={projectTitle}>{group.name}</h1>

        <div style={membersContainer}>
          {group.members.map((m, i) => (
            <div key={i} style={memberBadge}>
              {typeof m === "object" ? m.username : m}
            </div>
          ))}
        </div>
      </div>

      {/* NAV TABS */}
      <div style={tabWrapper}>
        <button
          style={activeTab === "schedule" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("schedule")}
        >
          Schedule
        </button>

        <button
          style={activeTab === "sprint" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("sprint")}
        >
          Sprint
        </button>

        <button
          style={activeTab === "meeting" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("meeting")}
        >
          Meetings
        </button>

        <button
          style={activeTab === "chat" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
      </div>

      {/* CONTENT */}
      <div style={contentContainer}>
        {activeTab === "schedule" && (
          <ScheduleMatching
            groupId={groupId}
            totalMembers={group.members.length}
          />
        )}

        {activeTab === "sprint" && (
          <SprintBoard members={group.members} />
        )}

        {activeTab === "meeting" && (
          <ScheduleMeeting groupId={groupId} />
        )}

        {activeTab === "chat" && (
          <GroupChat groupId={groupId} />
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageContainer = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "30px"
};

const headerCard = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginBottom: "20px"
};

const projectTitle = {
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "10px"
};

const membersContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const memberBadge = {
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "500"
};

const tabWrapper = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
};

const tabStyle = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#e2e8f0",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s"
};

const activeTabStyle = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  boxShadow: "0 3px 8px rgba(37,99,235,0.3)"
};

const contentContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

export default GroupPage;