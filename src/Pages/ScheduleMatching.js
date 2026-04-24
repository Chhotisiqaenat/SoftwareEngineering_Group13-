import React, { useState } from "react";

function ScheduleMatching({ groupId }) {
  const username = localStorage.getItem("username") || "User";

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const hours = [
    "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM",
    "5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM",
    "10:00 PM","11:00 PM","12:00 AM"
  ];

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);

  const toggleSlot = (day, time) => {
    const key = `${day}-${time}`;

    setSelectedSlots((prev) =>
      prev.includes(key)
        ? prev.filter((slot) => slot !== key)
        : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    try {
      const formattedSlots = selectedSlots.map((slot) => {
        const [day, time] = slot.split("-");
        return { day, time };
      });

      await fetch("http://localhost:5055/submit-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          groupId,
          slots: formattedSlots
        })
      });
    } catch (err) {
      console.log(err);
    }

    setSavedSlots([...selectedSlots]);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Schedule Matching</h2>

      {/* FIXED TABLE - NO WHITE GAP */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "130px" }}></th>

              {days.map((day) => (
                <th key={day} style={styles.header}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td style={styles.time}>{hour}</td>

                {days.map((day) => {
                  const key = `${day}-${hour}`;
                  const isSelected = selectedSlots.includes(key);

                  return (
                    <td
                      key={key}
                      onClick={() => toggleSlot(day, hour)}
                      style={{
                        ...styles.cell,
                        backgroundColor: isSelected
                          ? "#22c55e"
                          : "#f3f4f6"
                      }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button style={styles.saveBtn} onClick={handleSave}>
          Save Availability
        </button>

        <button style={styles.bestBtn}>
          Show Best 3 Time Windows
        </button>
      </div>

      {/* SAVED */}
      <div style={{ marginTop: "30px" }}>
        <h3>Your Saved Availability</h3>

        {savedSlots.length === 0 ? (
          <p style={{ color: "gray" }}>No availability saved yet</p>
        ) : (
          savedSlots.map((slot, index) => {
            const [day, time] = slot.split("-");

            return (
              <div key={index} style={styles.resultCard}>
                {username} is available on <b>{day}</b> at <b>{time}</b>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: "10px",
    background: "#e5e7eb",
    fontWeight: "bold",
    border: "1px solid #ccc"
  },

  time: {
    padding: "8px",
    fontWeight: "bold",
    width: "130px",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  },

  cell: {
    width: "90px",
    height: "44px",
    border: "1px solid #ccc",
    cursor: "pointer",
    transition: "0.2s"
  },

  saveBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer"
  },

  bestBtn: {
    background: "#1d4ed8",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  resultCard: {
    margin: "6px 0",
    padding: "10px",
    background: "#e0f2fe",
    borderRadius: "8px",
    width: "420px"
  }
};

export default ScheduleMatching;