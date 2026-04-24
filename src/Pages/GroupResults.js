import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function GroupResults() {
  const { groupId } = useParams();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

  const [overlap, setOverlap] = useState({});

  useEffect(() => {
    fetch("http://localhost:5055/group-availability/" + groupId)
      .then(res => res.json())
      .then(data => {
        const formatted = {};
        data.forEach(item => {
          formatted[item.slot] = item.percent;
        });
        setOverlap(formatted);
      });
  }, [groupId]);

  const getColor = (day, hour) => {
    const key = `${day}-${hour}`;
    const percent = overlap[key] || 0;

    if (percent === 100) return "#0f5132";
    if (percent >= 75) return "#198754";
    if (percent >= 50) return "#75c68f";
    if (percent > 0) return "#c3f0ca";
    return "white";
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Group Availability Results</h2>

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
              {days.map(day => (
                <td
                  key={`${day}-${hour}`}
                  style={{
                    backgroundColor: getColor(day, hour)
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "20px" }}>
        Darker green means more members available.
      </p>
    </div>
  );
}

export default GroupResults;
