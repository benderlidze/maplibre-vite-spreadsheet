import { MAP_STYLES } from "../../contants";

type MapStyleSwitcherProps = {
  currentStyle: keyof typeof MAP_STYLES;
  setCurrentStyle: (style: keyof typeof MAP_STYLES) => void;
};

export const MapStyleSwitcher = ({
  currentStyle,
  setCurrentStyle,
}: MapStyleSwitcherProps) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        zIndex: 10,
        display: "flex",
        flexDirection: "row",
        gap: "4px",
        padding: "5px",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "4px",
      }}
    >
      {Object.keys(MAP_STYLES).map((styleName) => (
        <button
          key={styleName}
          onClick={() => setCurrentStyle(styleName as keyof typeof MAP_STYLES)}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: currentStyle === styleName ? "#4285F4" : "#fff",
            color: currentStyle === styleName ? "#fff" : "#333",
          }}
        >
          {styleName}
        </button>
      ))}
    </div>
  );
};
