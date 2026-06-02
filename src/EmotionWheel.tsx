import React from "react";

type EmotionWheelProps = {
  selectedEmotion?: string;
  setEmotion: (value: string) => void;
};

type Emotion = {
  label: string;
  color: string;
};

type EmotionLayer = {
  className: string;
  d: string;
  emotions: Emotion[];
  labelRadius: number;
  labelSize: number;
  opacity: number;
  strokeWidth: number;
};

const emotionLayers: EmotionLayer[] = [
  {
    className: "outer",
    d: "M0,0 C 40,-140, 100,-140, 0,-280 C -100,-140, -40,-140, 0,0",
    labelRadius: 208,
    labelSize: 17,
    opacity: 0.72,
    strokeWidth: 2,
    emotions: [
      { label: "Rage", color: "#D7564A" },
      { label: "Terror", color: "#6D669C" },
      { label: "Ecstasy", color: "#88A96B" },
      { label: "Vigilance", color: "#DA8A35" },
      { label: "Admiration", color: "#2F9B86" },
      { label: "Amazement", color: "#D96A5C" },
      { label: "Grief", color: "#5AA9A5" },
      { label: "Loathing", color: "#D0A94F" },
    ],
  },
  {
    className: "middle",
    d: "M0,0 C 30,-92, 74,-92, 0,-188 C -74,-92, -30,-92, 0,0",
    labelRadius: 132,
    labelSize: 14,
    opacity: 0.78,
    strokeWidth: 1.75,
    emotions: [
      { label: "Anger", color: "#DB6A50" },
      { label: "Fear", color: "#9A79B5" },
      { label: "Joy", color: "#63B87D" },
      { label: "Anticipation", color: "#E56A4F" },
      { label: "Trust", color: "#34799A" },
      { label: "Surprise", color: "#E3B44B" },
      { label: "Sadness", color: "#3FA08C" },
      { label: "Disgust", color: "#DCC766" },
    ],
  },
  {
    className: "inner",
    d: "M0,0 C 20,-54, 46,-54, 0,-110 C -46,-54, -20,-54, 0,0",
    labelRadius: 68,
    labelSize: 11,
    opacity: 0.86,
    strokeWidth: 1.5,
    emotions: [
      { label: "Annoyance", color: "#C96053" },
      { label: "Apprehension", color: "#AF87C1" },
      { label: "Serenity", color: "#82CFA0" },
      { label: "Interest", color: "#E28A74" },
      { label: "Acceptance", color: "#5494B6" },
      { label: "Distraction", color: "#E6AE57" },
      { label: "Pensiveness", color: "#559782" },
      { label: "Boredom", color: "#D3C966" },
    ],
  },
];

function getOutlineColor(hex: string): string {
  const c = hex.replace("#", "");
  const r = Math.floor(parseInt(c.substring(0, 2), 16) * 0.68);
  const g = Math.floor(parseInt(c.substring(2, 4), 16) * 0.68);
  const b = Math.floor(parseInt(c.substring(4, 6), 16) * 0.68);
  return `rgb(${r}, ${g}, ${b})`;
}

const EmotionWheel: React.FC<EmotionWheelProps> = ({ selectedEmotion = "", setEmotion }) => {
  const [rotation, setRotation] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);
  const baseAngleRef = React.useRef(0);
  const startTimeRef = React.useRef<number | null>(null);
  const pausedRef = React.useRef(false);

  React.useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setRotation(0);
      return;
    }

    const durationMs = 110_000;
    const degPerMs = 360 / durationMs;

    const tick = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      if (!pausedRef.current) {
        const elapsed = now - startTimeRef.current;
        setRotation((baseAngleRef.current + elapsed * degPerMs) % 360);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const handleMouseEnter = () => {
    pausedRef.current = true;
    baseAngleRef.current = rotation;
    startTimeRef.current = performance.now();
  };

  const handleMouseLeave = () => {
    startTimeRef.current = performance.now();
    pausedRef.current = false;
  };

  const handleLabelKeyDown = (event: React.KeyboardEvent<SVGTextElement>, label: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setEmotion(label);
    }
  };

  return (
    <div className="emotion-wheel-shell">
      <svg
        className="emotion-wheel"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-310 -310 620 620"
        aria-label="Emotion wheel"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="lotus-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#203C35" floodOpacity="0.16" />
          </filter>
        </defs>

        <g className="emotion-wheel-rotor" transform={`rotate(${rotation})`}>
          <g filter="url(#lotus-shadow)">
            {emotionLayers.map((layer) => (
              <g key={layer.className} className={`emotion-layer ${layer.className}`}>
                {layer.emotions.map((emotion, index) => {
                  const selected = emotion.label.toLowerCase() === selectedEmotion.toLowerCase();
                  return (
                    <path
                      key={emotion.label}
                      className={`emotion-petal ${selected ? "is-selected" : ""}`}
                      d={layer.d}
                      fill={emotion.color}
                      opacity={selected ? 1 : layer.opacity}
                      stroke={selected ? "var(--wheel-selected)" : getOutlineColor(emotion.color)}
                      strokeWidth={selected ? layer.strokeWidth + 2 : layer.strokeWidth}
                      transform={`rotate(${index * 45 + 90})`}
                      onClick={() => setEmotion(emotion.label)}
                    >
                      <title>{emotion.label}</title>
                    </path>
                  );
                })}
              </g>
            ))}
          </g>

          {emotionLayers.map((layer) =>
            layer.emotions.map((emotion, index) => {
              const angle = index * 45 * (Math.PI / 180);
              const x = Math.cos(angle) * layer.labelRadius;
              const y = Math.sin(angle) * layer.labelRadius;
              const selected = emotion.label.toLowerCase() === selectedEmotion.toLowerCase();

              return (
                <text
                  key={`${layer.className}-${emotion.label}`}
                  x={x}
                  y={y}
                  className={`emotion-label ${selected ? "is-selected" : ""}`}
                  transform={`rotate(${-rotation} ${x} ${y})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={layer.labelSize}
                  role="button"
                  tabIndex={0}
                  aria-label={emotion.label}
                  onClick={() => setEmotion(emotion.label)}
                  onKeyDown={(event) => handleLabelKeyDown(event, emotion.label)}
                >
                  {emotion.label}
                </text>
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
};

export default EmotionWheel;
