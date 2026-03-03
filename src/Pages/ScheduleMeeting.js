import React, { useEffect, useState, useCallback } from "react";

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

  // ================= FETCH MEETINGS =================
  const fetchMeetings = useCallback(async () => {
    const res = await fetch(
      `http://localhost:5055/meetings/${groupId}`
    );
    const data = await res.json();
    setMeetings(data);
  }, [groupId]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // ================= CREATE =================
  const createMeeting = async () => {
    if (!title || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    await fetch("http://localhost:5055/create-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId,
        title,
        date,
        time
      })
    });

    setTitle("");
    setDate("");
    setTime("");
    fetchMeetings();
  };

  // ================= DELETE =================
  const deleteMeeting = async (meetingId) => {
    await fetch(
      `http://localhost:5055/delete-meeting/${meetingId}`,
      { method: "DELETE" }
    );

    fetchMeetings();
  };

  return (
    <div>
      <h3>Schedule a Meeting</h3>

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
          Create
        </button>
      </div>

      <h4 style={{ marginTop: "30px" }}>Upcoming Meetings</h4>

      {meetings.length === 0 && (
        <p>No meetings scheduled yet.</p>
      )}

      {meetings.map((meeting) => (
        <div key={meeting._id} style={styles.card}>
          <div>
            <strong>{meeting.title}</strong>
            <div>
              {meeting.date} — {formatTime(meeting.time)}
            </div>
          </div>

          <button
            style={styles.delete}
            onClick={() => deleteMeeting(meeting._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px"
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db"
  },
  primary: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  delete: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  }
};

export default ScheduleMeeting;