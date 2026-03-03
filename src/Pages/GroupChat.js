import React, { useEffect, useState, useCallback } from "react";

function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch current user ID
  useEffect(() => {
    const username = localStorage.getItem("username");

    fetch(`http://localhost:5055/user/${username}`)
      .then((res) => res.json())
      .then((data) => setUserId(data._id));
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(
      `http://localhost:5055/messages/${groupId}`
    );
    const data = await res.json();
    setMessages(data);
  }, [groupId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:5055/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId,
        userId,
        text
      })
    });

    setText("");
    fetchMessages();
  };

  return (
    <div>
      <h3>Group Chat</h3>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.userId.username}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default GroupChat;