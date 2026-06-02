import React from "react";

const DarkModeToggle: React.FC<{toggle: () => void; dark: boolean}> = ({toggle, dark}) => (
  <button onClick={toggle} className="toggle-btn" aria-label="Toggle dark mode">
    {dark ? "Light" : "Dark"}
  </button>
);

export default DarkModeToggle;
