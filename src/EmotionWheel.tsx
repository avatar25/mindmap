import React from "react";

type EmotionWheelProps = {
  setEmotion: (value: string) => void;
  selectedEmotion: string;
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

const EmotionWheel: React.FC<EmotionWheelProps> = ({ setEmotion, selectedEmotion }) => {
  const size = 600;
  const centerX = 0;
  const centerY = 0;
  const innerRadius = 40;
  const middleRadius = 100;
  const outerRadius = 180;
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
        {/* Group to hold all petals */}
        <g>
          {/* Outer layer */}
          <g id="outer-layer">
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#FF6F61" opacity="0.7" transform="rotate(0)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#6B5B95" opacity="0.7" transform="rotate(45)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#88B04B" opacity="0.7" transform="rotate(90)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#FFA500" opacity="0.7" transform="rotate(135)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#009B77" opacity="0.7" transform="rotate(180)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#DD4124" opacity="0.7" transform="rotate(225)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#45B8AC" opacity="0.7" transform="rotate(270)"/>
            <path d="M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0" 
                  fill="#EFC050" opacity="0.7" transform="rotate(315)"/>
          </g>

          {/* Middle layer */}
          <g id="middle-layer">
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#FFC300" opacity="0.7" transform="rotate(0)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#A569BD" opacity="0.7" transform="rotate(45)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#58D68D" opacity="0.7" transform="rotate(90)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#FF5733" opacity="0.7" transform="rotate(135)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#1F618D" opacity="0.7" transform="rotate(180)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#E74C3C" opacity="0.7" transform="rotate(225)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#16A085" opacity="0.7" transform="rotate(270)"/>
            <path d="M0,0 C 30,-90, 70,-90, 0,-180 C -70,-90, -30,-90, 0,0" 
                  fill="#F7DC6F" opacity="0.7" transform="rotate(315)"/>
          </g>

          {/* Inner layer */}
          <g id="inner-layer">
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#F5B041" opacity="0.8" transform="rotate(0)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#AF7AC5" opacity="0.8" transform="rotate(45)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#82E0AA" opacity="0.8" transform="rotate(90)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#EC7063" opacity="0.8" transform="rotate(135)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#2980B9" opacity="0.8" transform="rotate(180)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#C0392B" opacity="0.8" transform="rotate(225)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#117864" opacity="0.8" transform="rotate(270)"/>
            <path d="M0,0 C 20,-50, 40,-50, 0,-100 C -40,-50, -20,-50, 0,0" 
                  fill="#F4D03F" opacity="0.8" transform="rotate(315)"/>
          </g>
        </g>

        {/* Emotion labels */}
        {/* Outer layer labels */}
        {emotionLayers[0].emotions.map((emotion, index) => {
          // Center label in petal, slightly outward
          const angle = (index * 45) * (Math.PI / 180);
          const r = 200; // slightly less than petal tip
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
              fill={selectedEmotion === emotion.label ? "#fff" : "#111"}
              style={{ pointerEvents: "none" }}
            >
              {emotion.label}
            </text>
          );
        })}

        {/* Middle layer labels */}
        {emotionLayers[1].emotions.map((emotion, index) => {
          // Center label in petal, slightly outward
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
              fill={selectedEmotion === emotion.label ? "#fff" : "#111"}
              style={{ pointerEvents: "none" }}
            >
              {emotion.label}
            </text>
          );
        })}

        {/* Inner layer labels */}
        {emotionLayers[2].emotions.map((emotion, index) => {
          // Center label in petal, slightly outward
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
              fill={selectedEmotion === emotion.label ? "#fff" : "#111"}
              style={{ pointerEvents: "none" }}
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