// app/_components/categorias/form/ColorPresets.tsx
interface ColorPresetsProps {
  onSelect: (color: string) => void;
  currentColor: string;
}

export const ColorPresets = ({ onSelect, currentColor }: ColorPresetsProps) => {
  const presetColors = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#84CC16', // Lime
  ];

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">Cores predefinidas:</p>
      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
              currentColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};