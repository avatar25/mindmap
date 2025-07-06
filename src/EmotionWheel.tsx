import React from "react";

type EmotionWheelProps = {
  setEmotion: (value: string) => void;
  selectedEmotion: string;
};

const sectors = [
  { label: "Anger", color: "#f94144", stages: ["Annoyance", "Anger", "Rage"] },
  { label: "Anticipation", color: "#f3722c", stages: ["Interest", "Anticipation", "Vigilance"] },
  { label: "Joy", color: "#f9c74f", stages: ["Serenity", "Joy", "Ecstasy"] },
  { label: "Trust", color: "#90be6d", stages: ["Acceptance", "Trust", "Admiration"] },
  { label: "Fear", color: "#43aa8b", stages: ["Apprehension", "Fear", "Terror"] },
  { label: "Surprise", color: "#577590", stages: ["Distraction", "Surprise", "Amazement"] },
  { label: "Sadness", color: "#4d908e", stages: ["Pensiveness", "Sadness", "Grief"] },
  { label: "Disgust", color: "#277da1", stages: ["Boredom", "Disgust", "Loathing"] },
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

  const polarToCartesian = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  const describeArc = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const startOuter = polarToCartesian(startAngle, outerRadius);
    const endOuter = polarToCartesian(endAngle, outerRadius);
    const startInner = polarToCartesian(endAngle, innerRadius);
    const endInner = polarToCartesian(startAngle, innerRadius);

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerRadius, outerRadius, 0, largeArc, 1, endOuter.x, endOuter.y,
      "L", startInner.x, startInner.y,
      "A", innerRadius, innerRadius, 0, largeArc, 0, endInner.x, endInner.y,
      "Z"
    ].join(" ");
  };

  const renderWheel = () =>
    sectors.flatMap((sector, i) => {
      const startA = i * anglePerSector;
      const endA = startA + anglePerSector;

      return sector.stages.map((stage, j) => {
        const innerR = ringWidth * j;
        const outerR = ringWidth * (j + 1);
        const labelR = innerR + ringWidth * 0.7;  // push labels outward from center
        const midA = startA + anglePerSector / 2;
        const { x, y } = polarToCartesian(midA, labelR);

        const opacity = 0.4 + (j / (ringCount - 1)) * 0.6;
        // Make font size proportional to the ring's radius
        const minFont = 10;
        const maxFont = 32;
        const fontSize = minFont + ((outerR - ringWidth / 2) / radius) * (maxFont - minFont);
        const textOpacity = 0.4 + (j / 2) * 0.6;

        return (
          <g key={`${sector.label}-${stage}`}
             onClick={() => setEmotion(stage)}
             style={{ cursor: "pointer" }}>
            <path
              d={describeArc(innerR, outerR, startA, endA)}
              fill={sector.color}
              fillOpacity={opacity}
              stroke="#fff"
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={fontSize}
              fill={selectedEmotion === stage ? "#fff" : "#000"}
              fillOpacity={textOpacity}
              style={{ pointerEvents: "none" }}
            >
              {stage}
            </text>
          </g>
        );
      });
    });

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      style={{ maxWidth: size, maxHeight: size, display: "block", margin: "0 auto" }}
    >
      {renderWheel()}
    </svg>
  );
};

export default EmotionWheel;