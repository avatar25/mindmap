import { format, parseISO } from 'date-fns';

export type EmotionLog = {
  emotion: string;
  intensity: number;
  context?: string;
  journal?: string;
  timestamp: string;
};

export type CSVEmotionLog = {
  emotion: string;
  intensity: number;
  date: string;
  time: string;
  notes?: string;
};

// Improved date formatting: "6th July 2025 : 2:30PM"
export function formatDateDetailed(iso: string): string {
  const date = parseISO(iso);
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = format(date, 'MMMM');
  const year = date.getFullYear();
  const time = format(date, 'h:mm a');
  
  return `${day}${suffix} ${month} ${year} : ${time}`;
}

// Simple date formatting for timeline
export function formatDate(iso: string): string {
  const date = parseISO(iso);
  const today = new Date();
  
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  
  return format(date, 'dd-MM-yyyy');
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Export data as JSON
export function exportAsJSON(data: EmotionLog[]): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindmap-emotions-${format(new Date(), 'yyyy-MM-dd')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export data as CSV
export function exportAsCSV(data: EmotionLog[]): void {
  const headers = ['Emotion', 'Intensity', 'Context', 'Journal', 'Date', 'Time', 'Timestamp'];
  const csvContent = [
    headers.join(','),
    ...data.map(log => {
      const date = parseISO(log.timestamp);
      return [
        `"${log.emotion}"`,
        log.intensity,
        `"${log.context || ''}"`,
        `"${log.journal || ''}"`,
        format(date, 'yyyy-MM-dd'),
        format(date, 'HH:mm:ss'),
        log.timestamp
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindmap-emotions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import CSV data
export function importFromCSV(csvText: string): EmotionLog[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const emotionIndex = headers.findIndex(h => h.toLowerCase().includes('emotion'));
  const intensityIndex = headers.findIndex(h => h.toLowerCase().includes('intensity'));
  const contextIndex = headers.findIndex(h => h.toLowerCase().includes('context'));
  const journalIndex = headers.findIndex(h => h.toLowerCase().includes('journal'));
  const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const timeIndex = headers.findIndex(h => h.toLowerCase().includes('time'));
  const timestampIndex = headers.findIndex(h => h.toLowerCase().includes('timestamp'));

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    let timestamp: string;
    if (timestampIndex !== -1 && values[timestampIndex]) {
      timestamp = values[timestampIndex];
    } else if (dateIndex !== -1 && timeIndex !== -1) {
      const dateStr = values[dateIndex];
      const timeStr = values[timeIndex];
      timestamp = new Date(`${dateStr}T${timeStr}`).toISOString();
    } else {
      timestamp = new Date().toISOString();
    }

    return {
      emotion: values[emotionIndex] || 'Unknown',
      intensity: parseInt(values[intensityIndex]) || 5,
      context: contextIndex !== -1 ? values[contextIndex] || undefined : undefined,
      journal: journalIndex !== -1 ? values[journalIndex] || undefined : undefined,
      timestamp
    };
  }).filter(log => log.emotion !== 'Unknown');
}

// Analytics utilities
export function getWeeklySummary(data: EmotionLog[]): {
  totalLogs: number;
  averageIntensity: number;
  mostFrequentEmotion: string;
  emotionCounts: Record<string, number>;
} {
  if (data.length === 0) {
    return {
      totalLogs: 0,
      averageIntensity: 0,
      mostFrequentEmotion: 'None',
      emotionCounts: {}
    };
  }

  const emotionCounts: Record<string, number> = {};
  let totalIntensity = 0;

  data.forEach(log => {
    emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    totalIntensity += log.intensity;
  });

  const mostFrequentEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0][0];

  return {
    totalLogs: data.length,
    averageIntensity: Math.round((totalIntensity / data.length) * 10) / 10,
    mostFrequentEmotion,
    emotionCounts
  };
}

export function getMonthlySummary(data: EmotionLog[]): {
  totalLogs: number;
  averageIntensity: number;
  mostFrequentEmotion: string;
  emotionCounts: Record<string, number>;
  weeklyBreakdown: Array<{
    week: string;
    count: number;
    avgIntensity: number;
  }>;
} {
  const weeklySummary = getWeeklySummary(data);
  
  // Group by week
  const weeklyData: Record<string, EmotionLog[]> = {};
  
  data.forEach(log => {
    const date = parseISO(log.timestamp);
    const weekStart = format(date, 'yyyy-MM-dd');
    if (!weeklyData[weekStart]) {
      weeklyData[weekStart] = [];
    }
    weeklyData[weekStart].push(log);
  });

  const weeklyBreakdown = Object.entries(weeklyData).map(([week, logs]) => {
    const avgIntensity = logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length;
    return {
      week,
      count: logs.length,
      avgIntensity: Math.round(avgIntensity * 10) / 10
    };
  }).sort((a, b) => a.week.localeCompare(b.week));

  return {
    ...weeklySummary,
    weeklyBreakdown
  };
}

// Get data for specific time periods
export function getDataForPeriod(data: EmotionLog[], days: number): EmotionLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return data.filter(log => {
    const logDate = parseISO(log.timestamp);
    return logDate >= cutoffDate;
  });
} 