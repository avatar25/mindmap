

import React from "react";

type EmotionWheelProps = {
  setEmotion: (value: string) => void;
  selectedEmotion: string;
};

const sectors = [
  {
    label: "Anger",
    color: "#f94144",
    sub: ["Mad", "Frustrated", "Aggressive"]
  },
  {
    label: "Fear",
    color: "#43aa8b",
    sub: ["Anxious", "Insecure", "Scared"]
  },
  {
    label: "Sad",
    color: "#577590",
    sub: ["Lonely", "Depressed", "Guilty"]
  },
  {
    label: "Happy",
    color: "#f9c74f",
    sub: ["Joyful", "Proud", "Playful"]
  },
  {
    label: "Surprise",
    color: "#90be6d",
    sub: ["Startled", "Confused", "Amazed"]
  },
  {
    label: "Disgust",
    color: "#4d908e",
    sub: ["Disapproval", "Awful", "Embarrassed"]
  }
];

const EmotionWheel: React.FC<EmotionWheelProps> = ({ setEmotion, selectedEmotion }) => {
  const radius = 130;
  const cx = 150;
  const cy = 150;
  const anglePerSector = (2 * Math.PI) / sectors.length;

  const polarToCartesian = (angle: number, r: number) => {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const renderWheel = () => {
    return sectors.map((sector, i) => {
      const startAngle = i * anglePerSector;
      const midAngle = startAngle + anglePerSector / 2;
      const { x, y } = polarToCartesian(midAngle, radius);

      return (
        <g key={sector.label} onClick={() => setEmotion(sector.label)} style={{ cursor: "pointer" }}>
          <path
            d={describeArc(cx, cy, 0, radius, startAngle, startAngle + anglePerSector)}
            fill={selectedEmotion === sector.label ? "#000" : sector.color}
            stroke="#fff"
          />
          <text
            x={x}
            y={y}
            fill={selectedEmotion === sector.label ? "#fff" : "#000"}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="10"
          >
            {sector.label}
          </text>
        </g>
      );
    });
  };

  const describeArc = (
    x: number,
    y: number,
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

  return (
    <svg width={300} height={300} viewBox="0 0 300 300">
      {renderWheel()}
    </svg>
  );
};

export default EmotionWheel;