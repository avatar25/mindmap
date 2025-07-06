# MindMap

A comprehensive emotion tracking app built with React and TypeScript, featuring data analytics, import/export functionality, and beautiful visualizations. All data is stored locally in your browser.

## ✨ Features

### 🎯 Core Functionality
- **Emotion Wheel Selection**: Interactive emotion wheel for intuitive emotion logging
- **Intensity Tracking**: Rate your emotions on a 1-10 scale
- **Timeline View**: Chronological display of all your emotion logs with detailed timestamps
- **Search & Filter**: Find specific emotions in your timeline
- **Dark Mode**: Toggle between light and dark themes

### 📊 Analytics Dashboard
- **Weekly/Monthly Summaries**: Track your emotional patterns over time
- **Interactive Charts**: 
  - Bar charts showing top emotions
  - Line charts tracking intensity trends
  - Pie charts displaying emotion distribution
  - Weekly activity breakdown
- **Key Metrics**: Total logs, average intensity, most frequent emotions
- **Real-time Updates**: Analytics update automatically as you log emotions

### 📁 Data Management
- **Export Options**: Download your data as JSON or CSV
- **Import Functionality**: Upload CSV files to import historical data
- **Data Summary**: View statistics about your emotion logs
- **Duplicate Prevention**: Smart import that avoids duplicate entries

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**: Quick navigation and submission
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Improved Time Format**: Detailed timestamps (e.g., "6th July 2025 : 2:30PM")

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository or download the source code:

   ```bash
   git clone https://github.com/avatar25/mindmap.git
   cd mindmap
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
```

This will open the app in your default browser at [http://localhost:5173](http://localhost:5173).

### Building for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

The optimized build will be in the `dist/` directory.

## 📊 Using the Analytics Dashboard

1. **Access Analytics**: Click the "📊 Analytics" button in the timeline section
2. **View Charts**: Explore different visualizations of your emotional data
3. **Understand Patterns**: Use the weekly and monthly summaries to track trends
4. **Export Insights**: Download your data for further analysis

## 📁 Importing Data

### CSV Format
Your CSV file should have the following columns:
```
Emotion,Intensity,Date,Time,Timestamp
Happy,8,2025-01-15,14:30:00,2025-01-15T14:30:00.000Z
```

### Import Steps
1. Click the "📁 Data" button
2. Click "Choose CSV File"
3. Select your CSV file
4. Review the import results

## 🛠️ Built With

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Recharts** - Beautiful, composable charting library
- **date-fns** - Modern date utility library

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
