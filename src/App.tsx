import React, { useState, useEffect } from "react";
import EmotionWheel from "./EmotionWheel";
import DarkModeToggle from "./DarkModeToggle";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import DataManagement from "./components/DataManagement";
import { EmotionLog, formatDateDetailed } from "./utils/dataUtils";

const LOCAL_STORAGE_KEY = "emotionLog";
const MOOD_GOAL_KEY = "moodGoal";



const App: React.FC = () => {
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dark, setDark] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [context, setContext] = useState("");
  const [journal, setJournal] = useState("");
  type MoodGoal = { emotion: string; target: number };
  const [moodGoal, setMoodGoal] = useState<MoodGoal | null>(null);
  const [goalEmotion, setGoalEmotion] = useState("");
  const [goalTarget, setGoalTarget] = useState(1);

  // Load logs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
      const theme = localStorage.getItem("darkMode");
      setDark(theme === "true");
      const goal = localStorage.getItem(MOOD_GOAL_KEY);
      if (goal) {
        setMoodGoal(JSON.parse(goal));
      }
      setShowOnboarding(!localStorage.getItem("onboardingSeen"));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch {
      setError(true);
    }
  }, [logs]);

  // Save mood goal to localStorage whenever it changes
  useEffect(() => {
    if (moodGoal) {
      localStorage.setItem(MOOD_GOAL_KEY, JSON.stringify(moodGoal));
    } else {
      localStorage.removeItem(MOOD_GOAL_KEY);
    }
  }, [moodGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion.trim()) return;
    const newLog: EmotionLog = {
      emotion: emotion.trim(),
      intensity,
      context: context.trim() || undefined,
      journal: journal.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
    setEmotion("");
    setIntensity(5);
    setContext("");
    setJournal("");
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("darkMode", String(next));
    document.body.classList.toggle("dark", next);
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingSeen", "true");
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

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalEmotion.trim() || goalTarget <= 0) return;
    setMoodGoal({ emotion: goalEmotion.trim(), target: goalTarget });
    setGoalEmotion("");
    setGoalTarget(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && emotion.trim()) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleImportData = (newLogs: EmotionLog[]) => {
    setLogs(newLogs);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    setShowDataManagement(false);
  };

  const toggleDataManagement = () => {
    setShowDataManagement(!showDataManagement);
    setShowAnalytics(false);
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(log =>
    log.emotion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goalProgress = moodGoal
    ? logs.filter(
        (l) => l.emotion.toLowerCase() === moodGoal.emotion.toLowerCase()
      ).length
    : 0;

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>An error occurred while accessing local storage.</div>;
  }

  return (
    <>
      {showOnboarding && (
        <div className="onboarding-overlay" role="dialog" aria-modal="true">
          <div className="onboarding-content">
            <p>Welcome to MindMap! Select an emotion and log how you feel.</p>
            <button onClick={dismissOnboarding}>Got it</button>
          </div>
        </div>
      )}
      <DarkModeToggle toggle={toggleDark} dark={dark} />
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
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
                aria-label="Intensity"
              />
            </div>
            <input
              type="text"
              placeholder="Context or triggers (optional)"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                border: "1px solid #e1e5e9",
                marginBottom: "0.75rem",
                fontSize: "0.95rem",
                outline: "none"
              }}
              aria-label="Mood context"
            />
            <textarea
              placeholder="Journal entry (optional)"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                border: "1px solid #e1e5e9",
                marginBottom: "0.75rem",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical"
              }}
              rows={3}
              aria-label="Mood journal"
            />
            <button
              type="submit"
              disabled={!emotion.trim()}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                border: "none",
                background: "var(--primary-color)",
                color: "#fff",
                fontWeight: 300,
                fontSize: "1rem",
                cursor: "pointer",
                opacity: emotion.trim() ? 1 : 0.6
              }}
              aria-label="Log emotion"
            >
              Log Emotion
            </button>
          </form>
          <section style={{ width: "100%", maxWidth: 800 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem"
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
              
              {/* Navigation Buttons */}
              <div style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={toggleAnalytics}
                  style={{
                    background: showAnalytics ? "var(--primary-color)" : "transparent",
                    border: "1px solid var(--primary-color)",
                    color: showAnalytics ? "#fff" : "var(--primary-color)",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  title="View analytics dashboard"
                  aria-label="Toggle analytics dashboard"
                >
                  📊 Analytics
                </button>
                
                <button
                  onClick={toggleDataManagement}
                  style={{
                    background: showDataManagement ? "var(--primary-color)" : "transparent",
                    border: "1px solid var(--primary-color)",
                    color: showDataManagement ? "#fff" : "var(--primary-color)",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  title="Manage data import/export"
                  aria-label="Toggle data management"
                >
                  📁 Data
                </button>
                
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
                    aria-label="Clear all emotion logs"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            {/* Search input */}
            {logs.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Search emotions..."
                  aria-label="Search emotions"
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
                      className="log-item"
                      style={{
                        background: "var(--card-bg)",
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
                          <span style={{fontSize: "1.05rem", fontWeight: 500, color: "var(--text-color)"}}>
                            {log.emotion}
                          </span>
                          <span style={{fontSize: "0.95rem", color: "var(--primary-color)", display: "block", marginTop: "0.25rem"}}>
                            Intensity: {log.intensity}/10
                          </span>
                          {log.context && (
                            <span style={{fontSize: "0.9rem", color: "var(--text-color)", display: "block", marginTop: "0.25rem"}}>
                              Context: {log.context}
                            </span>
                          )}
                          {log.journal && (
                            <span style={{fontSize: "0.9rem", color: "var(--text-color)", display: "block", marginTop: "0.25rem"}}>
                              Journal: {log.journal}
                            </span>
                          )}
                          <span style={{fontSize: "0.85rem", color: "#888", display: "block", marginTop: "0.25rem"}}>
                            {formatDateDetailed(log.timestamp)}
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
                          aria-label="Delete this emotion log"
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
          
          {/* Analytics Dashboard */}
          <AnalyticsDashboard logs={logs} isVisible={showAnalytics} />
          
          {/* Data Management */}
          <DataManagement 
            logs={logs} 
            onImport={handleImportData} 
            isVisible={showDataManagement} 
          />
        </div>
      </div>
    </>
  );
};

export default App;
