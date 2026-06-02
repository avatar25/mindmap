import React, { useRef, useState } from "react";
import { EmotionLog, exportAsCSV, exportAsJSON, importFromCSV } from "../utils/dataUtils";

interface DataManagementProps {
  logs: EmotionLog[];
  onImport: (newLogs: EmotionLog[]) => void;
  isVisible: boolean;
}

const DataManagement: React.FC<DataManagementProps> = ({ logs, onImport, isVisible }) => {
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const clearMessagesLater = () => {
    window.setTimeout(() => {
      setImportError("");
      setImportSuccess("");
    }, 3000);
  };

  const handleExportJSON = () => {
    try {
      exportAsJSON(logs);
      setImportSuccess("Data exported as JSON successfully.");
    } catch {
      setImportError("Failed to export JSON data.");
    }
    clearMessagesLater();
  };

  const handleExportCSV = () => {
    try {
      exportAsCSV(logs);
      setImportSuccess("Data exported as CSV successfully.");
    } catch {
      setImportError("Failed to export CSV data.");
    }
    clearMessagesLater();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedLogs = importFromCSV(content);

        if (importedLogs.length === 0) {
          setImportError("No valid data found in the CSV file.");
          clearMessagesLater();
          return;
        }

        const existingTimestamps = new Set(logs.map((log) => log.timestamp));
        const newLogs = importedLogs.filter((log) => !existingTimestamps.has(log.timestamp));

        if (newLogs.length === 0) {
          setImportError("All data from the CSV already exists in your logs.");
          clearMessagesLater();
          return;
        }

        onImport([...newLogs, ...logs]);
        setImportSuccess(`Imported ${newLogs.length} new emotion logs.`);
        clearMessagesLater();

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch {
        setImportError("Failed to parse CSV file. Please check the format.");
        clearMessagesLater();
      }
    };

    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all emotion logs? This action cannot be undone.")) {
      onImport([]);
      setImportSuccess("All data cleared successfully.");
      clearMessagesLater();
    }
  };

  const averageIntensity =
    logs.length > 0 ? Math.round((logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length) * 10) / 10 : 0;

  return (
    <section className="panel data-panel" aria-label="Data management">
      <div className="section-heading">
        <p className="eyebrow">Data</p>
        <h2>Backups and imports</h2>
      </div>

      {importError && <div className="status-message error">{importError}</div>}
      {importSuccess && <div className="status-message success">{importSuccess}</div>}

      <div className="data-actions">
        <button className="primary-button" onClick={handleExportJSON} disabled={logs.length === 0}>
          Export JSON
        </button>
        <button className="secondary-button" onClick={handleExportCSV} disabled={logs.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="import-dropzone">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden-file-input"
        />
        <p>CSV upload</p>
        <button className="secondary-button" onClick={() => fileInputRef.current?.click()}>
          Choose file
        </button>
        <small>Emotion, Intensity, Date, Time, Timestamp</small>
      </div>

      <div className="metric-grid compact-metrics">
        <article className="metric-card">
          <span>Total logs</span>
          <strong>{logs.length}</strong>
        </article>
        <article className="metric-card">
          <span>Unique emotions</span>
          <strong>{new Set(logs.map((log) => log.emotion)).size}</strong>
        </article>
        <article className="metric-card">
          <span>Avg intensity</span>
          <strong>{averageIntensity}</strong>
        </article>
      </div>

      <div className="danger-zone">
        <div>
          <h3>Danger zone</h3>
          <p>These actions cannot be undone.</p>
        </div>
        <button className="danger-button" onClick={handleClearAll} disabled={logs.length === 0}>
          Clear all data
        </button>
      </div>
    </section>
  );
};

export default DataManagement;
