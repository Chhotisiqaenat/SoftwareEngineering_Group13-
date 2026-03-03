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
        const response = await fetch(
          `http://localhost:5055/group/${groupId}`
        );
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.log("Group fetch error:", error);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (!group) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>{group.name}</h2>
      <p>
        Members: {group.members.map((m) => m.username).join(", ")}
      </p>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "schedule" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("schedule")}
        >
          Schedule Matching
        </button>

        <button
          style={activeTab === "sprint" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("sprint")}
        >
          Project Sprint
        </button>

        <button
          style={activeTab === "meeting" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("meeting")}
        >
          Meetings
        </button>

        <button
          style={activeTab === "chat" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("chat")}
        >
          Group Chat
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === "schedule" && (
          <ScheduleMatching
            groupId={groupId}
            totalMembers={group.members.length}
          />
        )}

        {activeTab === "sprint" && (
          <SprintBoard groupId={groupId} />
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

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh"
  },
  tabContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },
  tab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#e5e7eb",
    cursor: "pointer"
  },
  activeTab: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer"
  },
  content: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px"
  }
};

export default GroupPage;