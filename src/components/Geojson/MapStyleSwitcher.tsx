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
    <div className="absolute bottom-2.5 left-2.5 z-10 flex flex-row gap-1 ">
      {Object.keys(MAP_STYLES).map((styleName) => (
        <button
          key={styleName}
          onClick={() => setCurrentStyle(styleName as keyof typeof MAP_STYLES)}
          className={`px-2 py-1.5 cursor-pointer text-xs rounded border whitespace-nowrap ${
            currentStyle === styleName
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {styleName}
        </button>
      ))}
    </div>
  );
};
