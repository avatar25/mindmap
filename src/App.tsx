import React, { useState, useEffect } from "react";
import EmotionWheel from "./EmotionWheel";

type EmotionLog = {
  emotion: string;
  intensity: number;
  timestamp: string;
};

const LOCAL_STORAGE_KEY = "emotionLog";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
}

const App: React.FC = () => {
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [logs, setLogs] = useState<EmotionLog[]>([]);

  // Load logs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch {
        console.error("Failed to parse emotion logs from localStorage.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion.trim()) return;
    const newLog: EmotionLog = {
      emotion: emotion.trim(),
      intensity,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
    setEmotion("");
    setIntensity(5);
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          textAlign: "center",
          marginTop: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: 700, letterSpacing: 2, color: "#4f8cff", margin: 0 }}>
          MindMap
        </h1>
      </div>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f6fa",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "2rem auto",
            padding: "3.0rem",
            borderRadius: 60,
            background: "#fff",
            boxShadow: "0 2px 12px #0001",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>MindMap</h1>
          <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", width: "100%" }}>
            
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: 650,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <EmotionWheel setEmotion={setEmotion} selectedEmotion={emotion} />
            </div>
            {/* Show selected emotion */}
            <div style={{ marginBottom: "1rem", fontWeight: 500, fontSize: "1.1rem", color: "#4f8cff" }}>
              {emotion ? `Selected: ${emotion}` : "Select an emotion"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem"
              }}
            >
              <label
                htmlFor="intensity"
                style={{ marginRight: 10, fontSize: "0.98rem", color: "#000" }}
              >
                Intensity: <strong>{intensity}/10</strong>
              </label>
              <input
                id="intensity"
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={{ flex: 1, maxWidth: 300 }}
              />
            </div>
            <button
              type="submit"
              disabled={!emotion.trim()}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                border: "none",
                background: "#4f8cff",
                color: "#fff",
                fontWeight: 300,
                fontSize: "1rem",
                cursor: "pointer",
                opacity: emotion.trim() ? 1 : 0.6
              }}
            >
              Log Emotion
            </button>
          </form>
          <section style={{ width: "100%", maxWidth: 500 }}>
            <h2 style={{fontSize: "1.1rem", marginBottom: "1rem", fontWeight: 500}}>Your Emotional Timeline</h2>
            {logs.length === 0 ? (
              <div style={{color: "#888", textAlign: "center"}}>No logs yet.</div>
            ) : (
              <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                {logs.map((log, idx) => (
                  <li
                    key={log.timestamp + idx}
                    style={{
                      background: "#f6f8fa",
                      borderRadius: 8,
                      padding: "0.75rem 1rem",
                      marginBottom: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem"
                    }}
                  >
                    <span style={{fontSize: "1.05rem", fontWeight: 500, color: "#000"}}>
                      {log.emotion}
                    </span>
                    <span style={{fontSize: "0.95rem", color: "#4f8cff"}}>
                      Intensity: {log.intensity}/10
                    </span>
                    <span style={{fontSize: "0.85rem", color: "#888"}}>
                      {formatDate(log.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default App;
