import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5055/group-details/" + groupId)
      .then(res => res.json())
      .then(data => setGroup(data));
  }, [groupId]);

  if (!group) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>{group.name}</h2>

      <p><strong>Invite Code:</strong> {group.inviteCode}</p>

      <h3>Members:</h3>
      {group.members.map(member => (
        <div key={member}>{member}</div>
      ))}

      <button onClick={() => navigate(`/group/${groupId}/availability`)}>
        Submit Availability
      </button>

      <button
        onClick={() => navigate(`/group/${groupId}/results`)}
        style={{ marginLeft: "10px" }}
      >
        View Results
      </button>
    </div>
  );
}

export default GroupDetails;