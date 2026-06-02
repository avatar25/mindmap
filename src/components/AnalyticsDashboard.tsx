import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmotionLog, getDataForPeriod, getMonthlySummary, getWeeklySummary } from "../utils/dataUtils";

interface AnalyticsDashboardProps {
  logs: EmotionLog[];
  isVisible: boolean;
}

const COLORS = ["#2f8f83", "#ce5a45", "#6478aa", "#d0a94f", "#4d97b2", "#9a79b5"];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs, isVisible }) => {
  if (!isVisible) return null;

  const weeklyData = getDataForPeriod(logs, 7);
  const monthlyData = getDataForPeriod(logs, 30);

  const weeklySummary = getWeeklySummary(weeklyData);
  const monthlySummary = getMonthlySummary(monthlyData);

  const emotionFrequencyData = Object.entries(weeklySummary.emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const intensityTrendData = [...weeklyData]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((log) => ({
      date: new Date(log.timestamp).toLocaleDateString(),
      intensity: log.intensity,
      emotion: log.emotion,
    }));

  const weeklyBreakdownData = monthlySummary.weeklyBreakdown.map((week) => ({
    week: new Date(week.week).toLocaleDateString(),
    logs: week.count,
    avgIntensity: week.avgIntensity,
  }));

  return (
    <section className="panel analytics-panel" aria-label="Analytics dashboard">
      <div className="section-heading">
        <p className="eyebrow">Analytics</p>
        <h2>Recent patterns</h2>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>This week</span>
          <strong>{weeklySummary.totalLogs}</strong>
          <small>emotions logged</small>
        </article>
        <article className="metric-card">
          <span>Avg intensity</span>
          <strong>{weeklySummary.averageIntensity}</strong>
          <small>out of 10</small>
        </article>
        <article className="metric-card">
          <span>Top emotion</span>
          <strong>{weeklySummary.mostFrequentEmotion}</strong>
          <small>most frequent</small>
        </article>
        <article className="metric-card">
          <span>This month</span>
          <strong>{monthlySummary.totalLogs}</strong>
          <small>total logs</small>
        </article>
      </div>

      {emotionFrequencyData.length === 0 ? (
        <div className="empty-state">No analytics yet.</div>
      ) : (
        <>
          <div className="chart-grid">
            <article className="chart-panel">
              <h3>Top emotions this week</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={emotionFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="emotion" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2f8f83" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </article>

            <article className="chart-panel">
              <h3>Intensity trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={intensityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="intensity" stroke="#ce5a45" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </article>
          </div>

          {weeklyBreakdownData.length > 0 && (
            <article className="chart-panel">
              <h3>Activity breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="logs" fill="#6478aa" name="Logs" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avgIntensity" fill="#d0a94f" name="Avg intensity" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </article>
          )}

          <article className="chart-panel">
            <h3>Emotion distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={emotionFrequencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, percent }) => `${emotion} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={86}
                  dataKey="count"
                >
                  {emotionFrequencyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </article>
        </>
      )}
    </section>
  );
};

export default AnalyticsDashboard;
