import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://chat-server-coral-eight.vercel.app", {
  transports: ["websocket", "polling"]
});

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", { username, message });
      setMessage("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <div>
          <ul id="messages">
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </li>
            ))}
          </ul>
          <form onSubmit={sendMessage}>
            <input
              id="m"
              autoComplete="off"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
