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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = (timestamp: string) => {
    setLogs(logs.filter(log => log.timestamp !== timestamp));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all emotion logs? This action cannot be undone.")) {
      setLogs([]);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && emotion.trim()) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(log =>
    log.emotion.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#DB87D4", fontSize: "3rem", fontWeight: 700, letterSpacing: 4 }}>MindMap</h1>
          <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} style={{ marginBottom: "2rem", width: "100%" }}>
            
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
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem"
            }}>
              <div>
                <h2 style={{fontSize: "1.1rem", fontWeight: 500, margin: 0}}>Your Emotional Timeline</h2>
                {logs.length > 0 && (
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "0.25rem"
                  }}>
                    {searchQuery 
                      ? `${filteredLogs.length} of ${logs.length} emotion${logs.length === 1 ? '' : 's'}`
                      : `${logs.length} emotion${logs.length === 1 ? '' : 's'} logged`
                    }
                  </div>
                )}
              </div>
              {logs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    background: "none",
                    border: "1px solid #ff6b6b",
                    color: "#ff6b6b",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff6b6b";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#ff6b6b";
                  }}
                  title="Delete all emotion logs"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Search input */}
            {logs.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Search emotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 8,
                    border: "1px solid #e1e5e9",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#4f8cff"}
                  onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
                />
              </div>
            )}
            
            {logs.length === 0 ? (
              <div style={{color: "#888", textAlign: "center"}}>No logs yet.</div>
            ) : (
              <>
                {/* Show search results count */}
                {searchQuery && (
                  <div style={{ 
                    fontSize: "0.9rem", 
                    color: "#666", 
                    marginBottom: "0.75rem",
                    textAlign: "center"
                  }}>
                    {filteredLogs.length === 0 
                      ? "No emotions found matching your search"
                      : `Found ${filteredLogs.length} emotion${filteredLogs.length === 1 ? '' : 's'}`
                    }
                  </div>
                )}
                
                <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                  {filteredLogs.map((log, idx) => (
                    <li
                      key={log.timestamp + idx}
                      style={{
                        background: "#f6f8fa",
                        borderRadius: 8,
                        padding: "0.75rem 1rem",
                        marginBottom: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        position: "relative"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                      }}>
                        <div style={{ flex: 1 }}>
                          <span style={{fontSize: "1.05rem", fontWeight: 500, color: "#000"}}>
                            {log.emotion}
                          </span>
                          <span style={{fontSize: "0.95rem", color: "#4f8cff", display: "block", marginTop: "0.25rem"}}>
                            Intensity: {log.intensity}/10
                          </span>
                          <span style={{fontSize: "0.85rem", color: "#888", display: "block", marginTop: "0.25rem"}}>
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(log.timestamp)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            padding: "0.25rem",
                            borderRadius: "4px",
                            transition: "background-color 0.2s",
                            marginLeft: "0.5rem"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ffe6e6"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Delete this emotion log"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default App;
