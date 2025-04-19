import React, { useState, useEffect } from "react";

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
      setLogs(JSON.parse(stored));
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
    <div style={{
      maxWidth: 400,
      margin: "2rem auto",
      padding: "1.5rem",
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 2px 12px #0001",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1 style={{textAlign: "center", marginBottom: "1.5rem"}}>MindMap</h1>
      <form onSubmit={handleSubmit} style={{marginBottom: "2rem"}}>
        <input
          type="text"
          value={emotion}
          onChange={e => setEmotion(e.target.value)}
          placeholder="What emotion are you feeling?"
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 8,
            border: "1px solid #ccc",
            marginBottom: "1rem"
          }}
        />
        <div style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}>
          <label htmlFor="intensity" style={{marginRight: 12, fontSize: "0.95rem"}}>
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
            style={{flex: 1}}
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
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            opacity: emotion.trim() ? 1 : 0.6
          }}
        >
          Log Emotion
        </button>
      </form>
      <section>
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
                <span style={{fontSize: "1.05rem", fontWeight: 500}}>
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
  );
};

export default App;
