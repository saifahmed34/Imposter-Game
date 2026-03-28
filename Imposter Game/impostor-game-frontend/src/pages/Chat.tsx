import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("connecting");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const roomId = sessionStorage.getItem("roomId");
  const playerName = sessionStorage.getItem("playerName");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId || !playerName) {
      navigate("/");
      return;
    }

    const connect = new HubConnectionBuilder()
      .withUrl(`https://dwtcck0w-5289.euw.devtunnels.ms/gamehub`)
      .configureLogging(LogLevel.Information)
      .build();

    connect.on("ReceiveMessage", (user, message) => {
      setMessages((prev) => [...prev, { user, message, time: new Date() }]);
    });

    connect
      .start()
      .then(() => {
        setStatus("connected");
        connect.invoke("JoinRoom", roomId, playerName);
      })
      .catch(() => setStatus("error"));

    connect.onclose(() => setStatus("disconnected"));

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [roomId, playerName, navigate]);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.invoke("SendMessage", roomId, playerName, newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const statusColors = {
    connecting: "#f59e0b",
    connected: "#10b981",
    disconnected: "#ef4444",
    error: "#ef4444",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050a0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-root {
          font-family: 'Rajdhani', sans-serif;
          background: #050a0f;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .chat-panel {
          width: 100%;
          max-width: 680px;
          background: #0b1117;
          border: 1px solid #1a2a3a;
          border-radius: 4px;
          box-shadow:
            0 0 0 1px #0d1f2d,
            0 0 60px rgba(0, 212, 255, 0.04),
            0 32px 80px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          height: 680px;
          position: relative;
          overflow: hidden;
        }

        /* Scanline overlay */
        .chat-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 212, 255, 0.012) 2px,
            rgba(0, 212, 255, 0.012) 4px
          );
          pointer-events: none;
          z-index: 10;
        }

        /* Top accent bar */
        .chat-panel::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00d4ff 30%, #00d4ff 70%, transparent);
          opacity: 0.6;
        }

        /* Header */
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #1a2a3a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #080e14;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .room-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #3a5a6a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .room-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: #00d4ff;
          letter-spacing: 0.05em;
        }

        .divider-v {
          width: 1px;
          height: 28px;
          background: #1a2a3a;
        }

        .player-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .player-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #00d4ff22, #00d4ff44);
          border: 1px solid #00d4ff55;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #00d4ff;
          text-transform: uppercase;
        }

        .player-name {
          font-size: 14px;
          font-weight: 600;
          color: #c8d8e8;
          letter-spacing: 0.05em;
        }

        .status-dot {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a5a6a;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--dot-color, #10b981);
          box-shadow: 0 0 6px var(--dot-color, #10b981);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Messages area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          scroll-behavior: smooth;
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: #1a2a3a; border-radius: 2px; }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #1e3040;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        .empty-icon {
          font-size: 32px;
          opacity: 0.3;
        }

        .message-row {
          display: flex;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 3px;
          transition: background 0.15s;
          align-items: flex-start;
          animation: msg-in 0.2s ease-out;
        }

        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-row:hover { background: #0f1a23; }

        .message-row.own {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 26px;
          height: 26px;
          background: #0f1a23;
          border: 1px solid #1a2a3a;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a7a8a;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .message-row.own .msg-avatar {
          background: #001a22;
          border-color: #00d4ff33;
          color: #00d4ff;
        }

        .msg-content { flex: 1; min-width: 0; }

        .msg-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 2px;
        }

        .message-row.own .msg-meta { flex-direction: row-reverse; }

        .msg-user {
          font-size: 12px;
          font-weight: 700;
          color: #4a9ab0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .message-row.own .msg-user { color: #00d4ff; }

        .msg-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #2a3a4a;
          letter-spacing: 0.05em;
        }

        .msg-text {
          font-size: 15px;
          font-weight: 500;
          color: #8aa8b8;
          line-height: 1.4;
          word-break: break-word;
        }

        .message-row.own .msg-text { color: #b0ccd8; text-align: right; }

        /* Input area */
        .input-area {
          padding: 16px 20px;
          border-top: 1px solid #1a2a3a;
          background: #080e14;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-shrink: 0;
        }

        .input-prefix {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #00d4ff;
          opacity: 0.5;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #c8d8e8;
          caret-color: #00d4ff;
          letter-spacing: 0.03em;
        }

        .chat-input::placeholder { color: #2a3a4a; }

        .send-btn {
          background: transparent;
          border: 1px solid #1a3a4a;
          border-radius: 3px;
          padding: 7px 18px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #00d4ff;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.15s;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .send-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #00d4ff;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .send-btn:hover {
          border-color: #00d4ff;
          color: #050a0f;
          box-shadow: 0 0 16px rgba(0, 212, 255, 0.3);
        }

        .send-btn:hover::before { opacity: 1; }
        .send-btn span { position: relative; z-index: 1; }

        .send-btn:hover span { color: #050a0f; }

        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .send-btn:disabled:hover { border-color: #1a3a4a; box-shadow: none; }
        .send-btn:disabled:hover::before { opacity: 0; }
        .send-btn:disabled:hover span { color: #00d4ff; }

        /* Vote button */
        .vote-btn {
          background: transparent;
          border: 1px solid #2a1a4a;
          border-radius: 3px;
          padding: 7px 18px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #a855f7;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.15s;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vote-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #a855f7;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .vote-btn:hover {
          border-color: #a855f7;
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
        }

        .vote-btn:hover::before { opacity: 1; }
        .vote-btn span { position: relative; z-index: 1; }
        .vote-btn:hover span { color: #050a0f; }

        /* Corner decorations */
        .corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: #00d4ff;
          border-style: solid;
          opacity: 0.4;
        }
        .corner-tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
        .corner-tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
        .corner-br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }
      `}</style>

      <div className="chat-root">
        <div className="chat-panel">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <div>
                <div className="room-label">Room</div>
                <div className="room-id">#{roomId || "—"}</div>
              </div>
              <div className="divider-v" />
              <div className="player-badge">
                <div className="player-avatar">
                  {playerName?.[0] || "?"}
                </div>
                <div className="player-name">{playerName || "Guest"}</div>
              </div>
            </div>

            <div
              className="status-dot"
              style={{ "--dot-color": statusColors[status] } as React.CSSProperties}
            >
              <div className="dot" />
              {status}
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <div>AWAITING TRANSMISSION</div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isOwn = msg.user === playerName;
                return (
                  <div key={i} className={`message-row ${isOwn ? "own" : ""}`}>
                    <div className="msg-avatar">
                      {msg.user?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="msg-content">
                      <div className="msg-meta">
                        <span className="msg-user">{msg.user}</span>
                        <span className="msg-time">{formatTime(msg.time)}</span>
                      </div>
                      <div className="msg-text">{msg.message}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <span className="input-prefix">&gt;_</span>
            <input
              className="chat-input"
              type="text"
              placeholder="Send a message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="vote-btn"
              onClick={() => navigate("/Game")}
            >
              <span>⬡ VOTE</span>
            </button>
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!newMessage.trim() || status !== "connected"}
            >
              <span>SEND</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;