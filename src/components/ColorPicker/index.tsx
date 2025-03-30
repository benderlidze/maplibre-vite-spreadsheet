import React, { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
}) => {
  const [color, setColor] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="w-10 h-10"
      />
      <input
        type="text"
        value={color}
        onChange={handleChange}
        className="border py-1 rounded w-20 text-center border-gray-300"
      />
    </div>
  );
};
