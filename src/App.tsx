import React, { useState, useEffect } from "react";

type EmotionLog = {
  emotion: string;
  intensity: number;
  timestamp: string;
};

const LOCAL_STORAGE_KEY = "emotionLog";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", " at");
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
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        maxWidth: 1000,
        width: "100%",
        margin: "2rem",
        padding: "3.0rem",
        borderRadius: 60,
        background: "#fff",
        boxShadow: "0 2px 12px #0001",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center"
      }}>
        <h1 style={{textAlign: "center", marginBottom: "1.5rem",fontFamily: "monospace", color: "red"}}>MindMap</h1>
        <div style={{ marginBottom: "2rem" }}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <g transform="translate(150,150)">
              {[
                { label: "Happy", angle: 0, color: "#FFD166" },
                { label: "Sad", angle: 60, color: "#A0C4FF" },
                { label: "Angry", angle: 120, color: "#FF6B6B" },
                { label: "Fearful", angle: 180, color: "#EF476F" },
                { label: "Disgusted", angle: 240, color: "#6C757D" },
                { label: "Surprised", angle: 300, color: "#9D4EDD" },
              ].map(({ label, angle, color }) => {
                const radians = (angle * Math.PI) / 180;
                const x = 100 * Math.cos(radians);
                const y = 100 * Math.sin(radians);
                return (
                  <g key={label} onClick={() => setEmotion(label)} style={{ cursor: "pointer" }}>
                    <circle cx={x} cy={y} r={30} fill={emotion === label ? "#000" : color} />
                    <text
                      x={x}
                      y={y}
                      fill={emotion === label ? "#fff" : "#000"}
                      textAnchor="middle"
                      alignmentBaseline="central"
                      fontSize="0.7rem"
                      fontFamily="sans-serif"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <form onSubmit={handleSubmit} style={{marginBottom: "2rem"}}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem"
          }}>
            {[
              { label: "Happy 😊", value: "Happy", color: "#FFD166" },
              { label: "Sad 😢", value: "Sad", color: "#A0C4FF" },
              { label: "Angry 😠", value: "Angry", color: "#FF6B6B" },
              { label: "Fearful 😨", value: "Fearful", color: "#EF476F" },
              { label: "Disgusted 🤢", value: "Disgusted", color: "#6C757D" },
              { label: "Surprised 😲", value: "Surprised", color: "#9D4EDD" },
              { label: "Bad 😔", value: "Bad", color: "#D9D9D9" }
            ].map(({ label, value, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setEmotion(value)}
                style={{
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "2px solid transparent",
                  backgroundColor: emotion === value ? color : "#f1f1f1",
                  color: emotion === value ? "#fff" : "#333",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1rem"
            }}
          >
            <label
              htmlFor="intensity"
              style={{ marginRight: 10, fontSize: "0.98rem" }}
            >
              Intensity: <strong>{intensity}/100</strong>
            </label>
            <input
              id="intensity"
              type="range"
              min={1}
              max={100}
              step={1}
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              style={{ flex: 1, maxWidth: 300 }}
            />
            <div style={{
              marginTop: 8,
              backgroundColor: "#4f8cff",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 12,
              fontSize: "0.85rem",
              transition: "all 0.2s ease"
            }}>
              {intensity}
            </div>
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
  );
};

export default App;
