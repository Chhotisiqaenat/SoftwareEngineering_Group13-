import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SubmitAvailability() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

  const [selectedSlots, setSelectedSlots] = useState([]);

  const toggleSlot = (day, time) => {
    const key = `${day}-${time}`;

    if (selectedSlots.includes(key)) {
      setSelectedSlots(selectedSlots.filter(slot => slot !== key));
    } else {
      setSelectedSlots([...selectedSlots, key]);
    }
  };

  const handleSave = async () => {
    const formattedSlots = selectedSlots.map(slot => {
      const [day, time] = slot.split("-");
      return { day, time };
    });

    await fetch("http://localhost:5055/submit-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        groupId,
        slots: formattedSlots
      })
    });

    navigate(`/group/${groupId}/results`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Select Your Availability</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th></th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {hours.map(hour => (
            <tr key={hour}>
              <td>{hour}</td>
              {days.map(day => {
                const key = `${day}-${hour}`;
                const isSelected = selectedSlots.includes(key);

                return (
                  <td
                    key={key}
                    onClick={() => toggleSlot(day, hour)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#75c68f" : "white"
                    }}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        style={{ marginTop: "20px" }}
      >
        Save Availability
      </button>
    </div>
  );
}

export default SubmitAvailability;