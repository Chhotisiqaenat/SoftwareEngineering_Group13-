import React, { useEffect, useState, useCallback, useRef } from "react";

function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const scrollRef = useRef(null); // To auto-scroll to the bottom

  useEffect(() => {
    const username = localStorage.getItem("username");
    fetch(`http://localhost:5055/user/${username}`)
      .then((res) => res.json())
      .then((data) => setUserId(data._id));
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`http://localhost:5055/messages/${groupId}`);
    const data = await res.json();
    setMessages(data);
  }, [groupId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await fetch("http://localhost:5055/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, userId, text })
    });
    setText("");
    fetchMessages();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Group Chat</h3>
      </div>

      <div style={styles.chatWindow} ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.userId._id === userId;
          return (
            <div key={msg._id} style={{
              ...styles.messageRow,
              justifyContent: isMe ? "flex-end" : "flex-start"
            }}>
              <div style={{
                ...styles.bubble,
                backgroundColor: isMe ? "#2563eb" : "#f3f4f6",
                color: isMe ? "white" : "#1f2937",
                borderRadius: isMe ? "18px 18px 0 18px" : "18px 18px 18px 0"
              }}>
                {!isMe && <div style={styles.username}>{msg.userId.username}</div>}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.inputArea}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "500px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden"
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff"
  },
  chatWindow: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#f9fafb"
  },
  messageRow: {
    display: "flex",
    width: "100%"
  },
  bubble: {
    padding: "10px 16px",
    maxWidth: "70%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    fontSize: "0.95rem",
    lineHeight: "1.4"
  },
  username: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#6b7280"
  },
  inputArea: {
    padding: "15px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "10px",
    backgroundColor: "white"
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "20px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "0.9rem"
  },
  sendButton: {
    padding: "8px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default GroupChat;