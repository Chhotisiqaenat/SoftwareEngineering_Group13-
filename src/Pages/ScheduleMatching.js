import React, { useEffect, useState, useCallback } from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const hours = [];
for (let i = 6; i <= 24; i++) {
  hours.push(i);
}

function formatHour(hour) {
  if (hour === 24) return "12:00 AM";
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${suffix}`;
}

function ScheduleMatching({ groupId, totalMembers }) {
  const [availability, setAvailability] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bestResults, setBestResults] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const username = localStorage.getItem("username");

  // ================= FETCH AVAILABILITY =================
  const fetchAvailability = useCallback(async () => {
  try {
    const res = await fetch(
      `http://localhost:5055/get-availability/${groupId}`
    );

    const data = await res.json();

    // 🔥 IMPORTANT FIX
    if (Array.isArray(data)) {
      setAvailability(data);
    } else {
      console.log("Availability not array:", data);
      setAvailability([]);
    }

  } catch (error) {
    console.log("Fetch availability error:", error);
    setAvailability([]);
  }
}, [groupId]);

  // ================= SLOT COUNT =================
  const getSlotCount = (key) => {
    return availability.filter(a =>
      a.slots?.includes(key)
    ).length;
  };

  // ================= COLOR =================
  const getColor = (key) => {
    if (selectedSlots.includes(key)) return "#22c55e";

    const count = getSlotCount(key);
    if (!count) return "#f3f4f6";

    const ratio = totalMembers
      ? count / totalMembers
      : 0;

    const green = Math.floor(220 - ratio * 170);
    return `rgb(34, ${green}, 94)`;
  };

  // ================= CLICK =================
  const toggleSlot = (key) => {
    setSelectedSlots(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleMouseDown = (key) => {
    setIsDragging(true);
    toggleSlot(key);
  };

  const handleMouseEnter = (key) => {
    if (isDragging) toggleSlot(key);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ================= SAVE =================
  const saveAvailability = async () => {
    await fetch("http://localhost:5055/save-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        username,
        slots: selectedSlots
      })
    });

    setSaveMessage("✅ Availability Saved!");
    setTimeout(() => setSaveMessage(""), 3000);

    fetchAvailability();
  };

  // ================= BEST 3 =================
  const generateBestTimes = () => {
    if (!availability || availability.length === 0) {
      alert("No availability submitted yet.");
      return;
    }

    const slotMap = {};

    availability.forEach(user => {
      user.slots?.forEach(slot => {
        slotMap[slot] = (slotMap[slot] || 0) + 1;
      });
    });

    const sorted = Object.entries(slotMap)
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      alert("No overlapping time slots found.");
      return;
    }

    const topThree = sorted.slice(0, 3);

    const formatted = topThree.map(([slot, count]) => {
      const [day, hour] = slot.split("-");
      return {
        label: `${day} at ${formatHour(Number(hour))}`,
        count
      };
    });

    setBestResults(formatted);
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <h3>Schedule Matching</h3>

      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
            {days.map(day => (
              <th key={day} style={styles.header}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td style={styles.time}>{formatHour(hour)}</td>
              {days.map(day => {
                const key = `${day}-${hour}`;
                return (
                  <td
                    key={key}
                    style={{
                      ...styles.cell,
                      backgroundColor: getColor(key)
                    }}
                    onMouseDown={() => handleMouseDown(key)}
                    onMouseEnter={() => handleMouseEnter(key)}
                    title={`${getSlotCount(key)} members available`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button style={styles.button} onClick={saveAvailability}>
          Save Availability
        </button>

        <button
          style={{ ...styles.button, marginLeft: "10px" }}
          onClick={generateBestTimes}
        >
          Show Best 3 Time Windows
        </button>

        {saveMessage && (
          <div style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
            {saveMessage}
          </div>
        )}
      </div>

      {bestResults.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h4>⭐ These are the 3 best available time slots:</h4>

          {bestResults.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                marginBottom: "6px",
                borderRadius: "6px",
                backgroundColor: index === 0 ? "#bbf7d0" : "#e5e7eb"
              }}
            >
              {item.label} — {item.count} members available
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  cell: {
    width: "60px",
    height: "35px",
    border: "1px solid #e5e7eb",
    cursor: "pointer"
  },
  header: {
    padding: "8px",
    border: "1px solid #e5e7eb"
  },
  time: {
    padding: "5px",
    fontSize: "12px",
    border: "1px solid #e5e7eb"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default ScheduleMatching;