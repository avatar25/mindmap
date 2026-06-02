import React, { useEffect, useState } from "react";
import EmotionWheel from "./EmotionWheel";
import DarkModeToggle from "./DarkModeToggle";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import DataManagement from "./components/DataManagement";
import { EmotionLog, formatDateDetailed } from "./utils/dataUtils";

const LOCAL_STORAGE_KEY = "emotionLog";
const MOOD_GOAL_KEY = "moodGoal";

type MoodGoal = { emotion: string; target: number };

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
  const [moodGoal, setMoodGoal] = useState<MoodGoal | null>(null);
  const [goalEmotion, setGoalEmotion] = useState("");
  const [goalTarget, setGoalTarget] = useState(1);

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
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch {
      setError(true);
    }
  }, [logs]);

  useEffect(() => {
    if (moodGoal) {
      localStorage.setItem(MOOD_GOAL_KEY, JSON.stringify(moodGoal));
    } else {
      localStorage.removeItem(MOOD_GOAL_KEY);
    }
  }, [moodGoal]);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

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

    setLogs((currentLogs) => [newLog, ...currentLogs]);
    setEmotion("");
    setIntensity(5);
    setContext("");
    setJournal("");
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("darkMode", String(next));
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingSeen", "true");
  };

  const handleDelete = (timestamp: string) => {
    setLogs((currentLogs) => currentLogs.filter((log) => log.timestamp !== timestamp));
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

  const handleImportData = (newLogs: EmotionLog[]) => {
    setLogs(newLogs);
  };

  const toggleAnalytics = () => {
    setShowAnalytics((visible) => !visible);
    setShowDataManagement(false);
  };

  const toggleDataManagement = () => {
    setShowDataManagement((visible) => !visible);
    setShowAnalytics(false);
  };

  const filteredLogs = logs.filter((log) =>
    log.emotion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goalProgress = moodGoal
    ? logs.filter((log) => log.emotion.toLowerCase() === moodGoal.emotion.toLowerCase()).length
    : 0;

  if (loading) {
    return <div className="app-state">Loading...</div>;
  }

  if (error) {
    return <div className="app-state">An error occurred while accessing local storage.</div>;
  }

  return (
    <main className="app-shell">
      {showOnboarding && (
        <div className="onboarding-overlay" role="dialog" aria-modal="true">
          <div className="onboarding-content">
            <p>Welcome to MindMap.</p>
            <button className="primary-button compact" onClick={dismissOnboarding}>
              Got it
            </button>
          </div>
        </div>
      )}

      <header className="app-header">
        <div>
          <p className="eyebrow">Mood journal</p>
          <h1>MindMap</h1>
        </div>
        <DarkModeToggle toggle={toggleDark} dark={dark} />
      </header>

      <section className="workspace" aria-label="Mood logging workspace">
        <section className="panel wheel-panel" aria-label="Emotion wheel">
          <div className="wheel-copy">
            <p className="eyebrow">Emotion wheel</p>
            <h2>{emotion || "No emotion selected"}</h2>
          </div>
          <EmotionWheel setEmotion={setEmotion} selectedEmotion={emotion} />
        </section>

        <section className="panel entry-panel" aria-label="Mood entry">
          <div className="section-heading">
            <p className="eyebrow">Check in</p>
            <h2>{emotion ? `Log ${emotion}` : "Choose a feeling"}</h2>
          </div>

          <form className="entry-form" onSubmit={handleSubmit}>
            <div className="selected-bar">
              <span>Selected</span>
              <strong>{emotion || "None"}</strong>
            </div>

            <label className="range-row" htmlFor="intensity">
              <span>
                Intensity <strong>{intensity}/10</strong>
              </span>
              <input
                id="intensity"
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                aria-label="Intensity"
              />
            </label>

            <label className="field-label">
              Context
              <input
                type="text"
                placeholder="Trigger, place, person"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                aria-label="Mood context"
              />
            </label>

            <label className="field-label">
              Journal
              <textarea
                placeholder="A few lines about it"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                rows={4}
                aria-label="Mood journal"
              />
            </label>

            <button className="primary-button" type="submit" disabled={!emotion.trim()}>
              Log emotion
            </button>
          </form>

          <form className="goal-form" onSubmit={handleGoalSubmit}>
            <label className="field-label goal-emotion">
              Goal
              <input
                type="text"
                placeholder="Emotion"
                value={goalEmotion}
                onChange={(e) => setGoalEmotion(e.target.value)}
                aria-label="Goal emotion"
              />
            </label>
            <label className="field-label goal-target">
              Count
              <input
                type="number"
                min={1}
                value={goalTarget}
                onChange={(e) => setGoalTarget(Number(e.target.value))}
                aria-label="Goal target"
              />
            </label>
            <button className="secondary-button" type="submit">
              Set goal
            </button>
          </form>

          {moodGoal && (
            <div className="goal-progress">
              <div>
                <span>Goal</span>
                <strong>
                  {moodGoal.emotion} {goalProgress}/{moodGoal.target}
                </strong>
              </div>
              <button className="ghost-danger-button" onClick={() => setMoodGoal(null)}>
                Clear
              </button>
            </div>
          )}
        </section>
      </section>

      <section className="panel timeline-panel" aria-label="Emotional timeline">
        <div className="timeline-header">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>Your emotional timeline</h2>
            {logs.length > 0 && (
              <p className="muted">
                {searchQuery
                  ? `${filteredLogs.length} of ${logs.length} emotion${logs.length === 1 ? "" : "s"}`
                  : `${logs.length} emotion${logs.length === 1 ? "" : "s"} logged`}
              </p>
            )}
          </div>

          <div className="toolbar" aria-label="Timeline tools">
            <button
              className={`toggle-pill ${showAnalytics ? "is-active" : ""}`}
              onClick={toggleAnalytics}
              aria-label="Toggle analytics dashboard"
            >
              Analytics
            </button>
            <button
              className={`toggle-pill ${showDataManagement ? "is-active" : ""}`}
              onClick={toggleDataManagement}
              aria-label="Toggle data management"
            >
              Data
            </button>
            {logs.length > 0 && (
              <button className="danger-button" onClick={handleClearAll} aria-label="Clear all emotion logs">
                Clear all
              </button>
            )}
          </div>
        </div>

        {logs.length > 0 && (
          <input
            className="search-input"
            type="text"
            placeholder="Search emotions"
            aria-label="Search emotions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {logs.length === 0 ? (
          <div className="empty-state">No logs yet.</div>
        ) : (
          <>
            {searchQuery && (
              <p className="search-results">
                {filteredLogs.length === 0
                  ? "No emotions found matching your search"
                  : `Found ${filteredLogs.length} emotion${filteredLogs.length === 1 ? "" : "s"}`}
              </p>
            )}

            <ul className="log-list">
              {filteredLogs.map((log, idx) => (
                <li key={log.timestamp + idx} className="log-item">
                  <div className="log-main">
                    <div>
                      <strong>{log.emotion}</strong>
                      <span>Intensity {log.intensity}/10</span>
                    </div>
                    <time>{formatDateDetailed(log.timestamp)}</time>
                    {log.context && <p>Context: {log.context}</p>}
                    {log.journal && <p>Journal: {log.journal}</p>}
                  </div>
                  <button
                    className="delete-log-button"
                    onClick={() => handleDelete(log.timestamp)}
                    title="Delete this emotion log"
                    aria-label="Delete this emotion log"
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <AnalyticsDashboard logs={logs} isVisible={showAnalytics} />
      <DataManagement logs={logs} onImport={handleImportData} isVisible={showDataManagement} />
    </main>
  );
};

export default App;
