// app/_components/molecules/FormColorPicker.tsx
'use client';

interface FormColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
  '#A855F7', // Violet
];

export const FormColorPicker = ({ label, value, onChange }: FormColorPickerProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="space-y-4">
        {/* Cores Predefinidas */}
        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Cores sugeridas</p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => onChange(presetColor)}
                className={`w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 ${
                  value === presetColor 
                    ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' 
                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-300'
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Color Picker Customizado */}
        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Cor personalizada</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer border-2 border-slate-200"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all uppercase"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};