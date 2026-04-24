import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 1. Add this import

function formatTime(timeString) {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

function ScheduleMeeting({ groupId }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetings, setMeetings] = useState([]);
  
  const navigate = useNavigate(); // 2. Initialize navigation

  // ================= FETCH MEETINGS =================
  const fetchMeetings = useCallback(async () => {
    const res = await fetch(`http://localhost:5055/meetings/${groupId}`);
    const data = await res.json();
    setMeetings(data);
  }, [groupId]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // ================= JOIN MEETING =================
  const joinMeeting = (meetingId) => {
    // Navigates to the video call route with the unique meeting ID as the room
    navigate(`/video-call/${meetingId}`);
  };

  // ================= CREATE =================
  const createMeeting = async () => {
    if (!title || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    await fetch("http://localhost:5055/create-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, title, date, time })
    });

    setTitle("");
    setDate("");
    setTime("");
    fetchMeetings();
  };

  // ================= DELETE =================
  const deleteMeeting = async (meetingId) => {
    await fetch(`http://localhost:5055/delete-meeting/${meetingId}`, { method: "DELETE" });
    fetchMeetings();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Schedule a Meeting</h3>

      <div style={styles.formRow}>
        <input
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={createMeeting} style={styles.primary}>
          Create Meeting
        </button>
      </div>

      <h4 style={{ marginTop: "40px", color: "#374151" }}>Upcoming Meetings</h4>

      {meetings.length === 0 && (
        <p style={{ color: "#6b7280", fontStyle: "italic" }}>No meetings scheduled yet.</p>
      )}

      {meetings.map((meeting) => (
        <div key={meeting._id} style={styles.card}>
          <div style={styles.cardInfo}>
            <strong style={styles.cardTitle}>{meeting.title}</strong>
            <div style={styles.cardDate}>
              {meeting.date} — {formatTime(meeting.time)}
            </div>
          </div>

          <div style={styles.buttonGroup}>
            {/* 3. The New Join Button */}
            <button 
              style={styles.join} 
              onClick={() => joinMeeting(meeting._id)}
            >
              Join Call
            </button>
            
            <button
              style={styles.delete}
              onClick={() => deleteMeeting(meeting._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px"
  },
  header: {
    color: "#111827",
    marginBottom: "20px"
  },
  formRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    flex: "1",
    minWidth: "150px"
  },
  primary: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "16px 20px",
    marginTop: "12px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  cardTitle: {
    fontSize: "1.1rem",
    color: "#1f2937"
  },
  cardDate: {
    color: "#6b7280",
    fontSize: "0.9rem",
    marginTop: "4px"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px"
  },
  join: {
    backgroundColor: "#10b981", // Green for join
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
  },
  delete: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer"
  }
};

export default ScheduleMeeting;