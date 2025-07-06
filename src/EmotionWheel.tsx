import React from "react";

type EmotionWheelProps = {
  setEmotion: (value: string) => void;
};

// Map emotions to the 8 petals of the lotus
const emotionLayers = [
  // Outer layer - intense emotions
  {
    emotions: [
      { label: "Rage", color: "#DD4124" },
      { label: "Terror", color: "#6B5B95" },
      { label: "Ecstasy", color: "#88B04B" },
      { label: "Vigilance", color: "#FFA500" },
      { label: "Admiration", color: "#009B77" },
      { label: "Amazement", color: "#FF6F61" },
      { label: "Grief", color: "#45B8AC" },
      { label: "Loathing", color: "#EFC050" }
    ]
  },
  // Middle layer - moderate emotions
  {
    emotions: [
      { label: "Anger", color: "#E74C3C" },
      { label: "Fear", color: "#A569BD" },
      { label: "Joy", color: "#58D68D" },
      { label: "Anticipation", color: "#FF5733" },
      { label: "Trust", color: "#1F618D" },
      { label: "Surprise", color: "#FFC300" },
      { label: "Sadness", color: "#16A085" },
      { label: "Disgust", color: "#F7DC6F" }
    ]
  },
  // Inner layer - mild emotions
  {
    emotions: [
      { label: "Annoyance", color: "#C0392B" },
      { label: "Apprehension", color: "#AF7AC5" },
      { label: "Serenity", color: "#82E0AA" },
      { label: "Interest", color: "#EC7063" },
      { label: "Acceptance", color: "#2980B9" },
      { label: "Distraction", color: "#F5B041" },
      { label: "Pensiveness", color: "#117864" },
      { label: "Boredom", color: "#F4D03F" }
    ]
  }
];

// Utility to get petal color for each layer and index
const petalColors = [
  ["#FF6F61", "#6B5B95", "#88B04B", "#FFA500", "#009B77", "#DD4124", "#45B8AC", "#EFC050"], // outer
  ["#FFC300", "#A569BD", "#58D68D", "#FF5733", "#1F618D", "#E74C3C", "#16A085", "#F7DC6F"], // middle
  ["#F5B041", "#AF7AC5", "#82E0AA", "#EC7063", "#2980B9", "#C0392B", "#117864", "#F4D03F"]  // inner
];

// Utility to get contrasting text shadow (white for dark petals, black for light petals)
function getTextShadow(hex: string): string {
  // Simple luminance check
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance > 0.5 ? '0 0 8px #222, 0 0 2px #222' : '0 0 8px #fff, 0 0 2px #fff';
}

// Utility to get a darker outline color
function getOutlineColor(hex: string): string {
  const c = hex.replace('#', '');
  let r = Math.floor(parseInt(c.substring(0,2),16) * 0.7);
  let g = Math.floor(parseInt(c.substring(2,4),16) * 0.7);
  let b = Math.floor(parseInt(c.substring(4,6),16) * 0.7);
  return `rgb(${r},${g},${b})`;
}

const EmotionWheel: React.FC<EmotionWheelProps> = ({ setEmotion }) => {
  const size = 600;
  const middleRadius = 100;
  const middleLayerMax = 180;
  const outerLayerMax = 280;

  const getEmotionAtPosition = (angle: number, layer: number) => {
    // Normalize angle to 0-360 range before calculating the sector.
    const normalized = (angle + 360 + 22.5) % 360;
    const sectorIndex = Math.floor(normalized / 45);
    return emotionLayers[layer].emotions[sectorIndex];
  };

  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    
    let layer = -1;
    if (distance <= middleRadius) {
      layer = 2; // Inner layer
    } else if (distance <= middleLayerMax) {
      layer = 1; // Middle layer
    } else if (distance <= outerLayerMax) {
      layer = 0; // Outer layer
    } else {
      return; // Click outside the lotus
    }
    
    const emotion = getEmotionAtPosition(angle, layer);
    if (emotion) {
      setEmotion(emotion.label);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="-300 -300 600 600"
        onClick={handleClick}
        style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="lotus-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>
        {/* Group to hold all petals with drop shadow */}
        <g filter="url(#lotus-shadow)">
          {/* Outer layer */}
          <g id="outer-layer">
            {petalColors[0].map((color, i) => (
              <path
                key={color}
                d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0"
                fill={color}
                opacity="0.7"
                stroke={getOutlineColor(color)}
                strokeWidth={3}
                transform={`rotate(${i*45})`}
              />
            ))}
          </g>
          {/* Middle layer */}
          <g id="middle-layer">
            {petalColors[1].map((color, i) => (
              <path
                key={color}
                d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0"
                fill={color}
                opacity="0.7"
                stroke={getOutlineColor(color)}
                strokeWidth={2.5}
                transform={`rotate(${i*45})`}
              />
            ))}
          </g>
          {/* Inner layer */}
          <g id="inner-layer">
            {petalColors[2].map((color, i) => (
              <path
                key={color}
                d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0"
                fill={color}
                opacity="0.8"
                stroke={getOutlineColor(color)}
                strokeWidth={2}
                transform={`rotate(${i*45})`}
              />
            ))}
          </g>
        </g>
        {/* Emotion labels */}
        {/* Outer layer labels */}
        {emotionLayers[0].emotions.map((emotion, index) => {
          const color = petalColors[0][index];
          const angle = (index * 45) * (Math.PI / 180);
          const r = 200;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <text
              key={`outer-${emotion.label}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fontWeight="bold"
              fill={color}
              style={{ pointerEvents: "none", textShadow: getTextShadow(color) }}
            >
              {emotion.label}
            </text>
          );
        })}
        {/* Middle layer labels */}
        {emotionLayers[1].emotions.map((emotion, index) => {
          const color = petalColors[1][index];
          const angle = (index * 45) * (Math.PI / 180);
          const r = 120;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <text
              key={`middle-${emotion.label}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="15"
              fontWeight="bold"
              fill={color}
              style={{ pointerEvents: "none", textShadow: getTextShadow(color) }}
            >
              {emotion.label}
            </text>
          );
        })}
        {/* Inner layer labels */}
        {emotionLayers[2].emotions.map((emotion, index) => {
          const color = petalColors[2][index];
          const angle = (index * 45) * (Math.PI / 180);
          const r = 60;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <text
              key={`inner-${emotion.label}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="bold"
              fill={color}
              style={{ pointerEvents: "none", textShadow: getTextShadow(color) }}
            >
              {emotion.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default EmotionWheel;