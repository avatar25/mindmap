import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { EmotionLog, getWeeklySummary, getMonthlySummary, getDataForPeriod } from '../utils/dataUtils';

interface AnalyticsDashboardProps {
  logs: EmotionLog[];
  isVisible: boolean;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000',
  '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs, isVisible }) => {
  if (!isVisible) return null;

  const weeklyData = getDataForPeriod(logs, 7);
  const monthlyData = getDataForPeriod(logs, 30);
  
  const weeklySummary = getWeeklySummary(weeklyData);
  const monthlySummary = getMonthlySummary(monthlyData);

  // Prepare data for charts
  const emotionFrequencyData = Object.entries(weeklySummary.emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const intensityTrendData = weeklyData
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(log => ({
      date: new Date(log.timestamp).toLocaleDateString(),
      intensity: log.intensity,
      emotion: log.emotion
    }));

  const weeklyBreakdownData = monthlySummary.weeklyBreakdown.map(week => ({
    week: new Date(week.week).toLocaleDateString(),
    logs: week.count,
    avgIntensity: week.avgIntensity
  }));

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
        📊 Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1rem',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>This Week</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{weeklySummary.totalLogs}</div>
          <div style={{ fontSize: '0.8rem' }}>emotions logged</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '1rem',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Avg Intensity</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{weeklySummary.averageIntensity}</div>
          <div style={{ fontSize: '0.8rem' }}>out of 10</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '1rem',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Top Emotion</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weeklySummary.mostFrequentEmotion}</div>
          <div style={{ fontSize: '0.8rem' }}>most frequent</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '1rem',
          borderRadius: '8px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>This Month</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{monthlySummary.totalLogs}</div>
          <div style={{ fontSize: '0.8rem' }}>total logs</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Emotion Frequency Chart */}
        {emotionFrequencyData.length > 0 && (
          <div style={{
            background: 'var(--bg-color)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
              Top Emotions This Week
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Intensity Trend Chart */}
        {intensityTrendData.length > 0 && (
          <div style={{
            background: 'var(--bg-color)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
              Intensity Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={intensityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="intensity" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Weekly Breakdown */}
      {weeklyBreakdownData.length > 0 && (
        <div style={{
          background: 'var(--bg-color)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
            Weekly Activity Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="logs" fill="#8884d8" name="Logs" />
              <Bar yAxisId="right" dataKey="avgIntensity" fill="#82ca9d" name="Avg Intensity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotion Distribution Pie Chart */}
      {emotionFrequencyData.length > 0 && (
        <div style={{
          background: 'var(--bg-color)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
            Emotion Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionFrequencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ emotion, percent }) => `${emotion} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {emotionFrequencyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 