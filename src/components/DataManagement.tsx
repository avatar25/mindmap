import React, { useState, useRef } from 'react';
import { EmotionLog, exportAsJSON, exportAsCSV, importFromCSV } from '../utils/dataUtils';

interface DataManagementProps {
  logs: EmotionLog[];
  onImport: (newLogs: EmotionLog[]) => void;
  isVisible: boolean;
}

const DataManagement: React.FC<DataManagementProps> = ({ logs, onImport, isVisible }) => {
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleExportJSON = () => {
    try {
      exportAsJSON(logs);
      setImportSuccess('Data exported as JSON successfully!');
      setTimeout(() => setImportSuccess(''), 3000);
    } catch (error) {
      setImportError('Failed to export JSON data');
      setTimeout(() => setImportError(''), 3000);
    }
  };

  const handleExportCSV = () => {
    try {
      exportAsCSV(logs);
      setImportSuccess('Data exported as CSV successfully!');
      setTimeout(() => setImportSuccess(''), 3000);
    } catch (error) {
      setImportError('Failed to export CSV data');
      setTimeout(() => setImportError(''), 3000);
    }
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
          setImportError('No valid data found in the CSV file');
          setTimeout(() => setImportError(''), 3000);
          return;
        }

        // Merge with existing data, avoiding duplicates
        const existingTimestamps = new Set(logs.map(log => log.timestamp));
        const newLogs = importedLogs.filter(log => !existingTimestamps.has(log.timestamp));
        
        if (newLogs.length === 0) {
          setImportError('All data from the CSV already exists in your logs');
          setTimeout(() => setImportError(''), 3000);
          return;
        }

        onImport([...newLogs, ...logs]);
        setImportSuccess(`Successfully imported ${newLogs.length} new emotion logs!`);
        setTimeout(() => setImportSuccess(''), 3000);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError('Failed to parse CSV file. Please check the format.');
        setTimeout(() => setImportError(''), 3000);
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all emotion logs? This action cannot be undone.')) {
      onImport([]);
      setImportSuccess('All data cleared successfully!');
      setTimeout(() => setImportSuccess(''), 3000);
    }
  };

  return (
    <div style={{
      padding: '1rem',
      background: 'var(--card-bg)',
      borderRadius: '12px',
      marginTop: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: 'var(--text-color)',
        fontSize: '1.5rem'
      }}>
        📁 Data Management
      </h2>

      {/* Status Messages */}
      {importError && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {importError}
        </div>
      )}

      {importSuccess && (
        <div style={{
          background: '#efe',
          color: '#363',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          border: '1px solid #cfc'
        }}>
          {importSuccess}
        </div>
      )}

      {/* Export Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          Export Your Data
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-color)',
              color: 'white',
              cursor: logs.length > 0 ? 'pointer' : 'not-allowed',
              opacity: logs.length > 0 ? 1 : 0.6,
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            📄 Export as JSON
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#28a745',
              color: 'white',
              cursor: logs.length > 0 ? 'pointer' : 'not-allowed',
              opacity: logs.length > 0 ? 1 : 0.6,
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            📊 Export as CSV
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          Import Data
        </h3>
        <div style={{
          background: 'var(--bg-color)',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px dashed var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{
            margin: '0 0 1rem 0',
            color: 'var(--text-color)',
            fontSize: '0.9rem'
          }}>
            Upload a CSV file with your emotion data
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--primary-color)',
              background: 'transparent',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-color)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--primary-color)';
            }}
          >
            📁 Choose CSV File
          </button>
        </div>
        
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--bg-color)',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: 'var(--text-color)'
        }}>
          <strong>CSV Format:</strong> Emotion,Intensity,Date,Time,Timestamp
          <br />
          <strong>Example:</strong> Happy,8,2025-01-15,14:30:00,2025-01-15T14:30:00.000Z
        </div>
      </div>

      {/* Data Summary */}
      <div style={{
        background: 'var(--bg-color)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          Data Summary
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {logs.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
              Total Logs
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              {new Set(logs.map(log => log.emotion)).size}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
              Unique Emotions
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
              {logs.length > 0 
                ? Math.round((logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length) * 10) / 10
                : 0
              }
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
              Avg Intensity
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{
        border: '2px solid #dc3545',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        <h3 style={{
          color: '#dc3545',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          ⚠️ Danger Zone
        </h3>
        <p style={{
          color: 'var(--text-color)',
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}>
          These actions cannot be undone. Please be careful.
        </p>
        <button
          onClick={handleClearAll}
          disabled={logs.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            background: '#dc3545',
            color: 'white',
            cursor: logs.length > 0 ? 'pointer' : 'not-allowed',
            opacity: logs.length > 0 ? 1 : 0.6,
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export default DataManagement; 