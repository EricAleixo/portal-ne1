import { Tag } from 'lucide-react';

interface CategoryPreviewProps {
  name: string;
  color: string;
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export const CategoryPreview = ({ name, color }: CategoryPreviewProps) => {
  const displayName = name || 'Nome da Categoria';
  
  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
      <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
        Prévia da Categoria
      </p>
      
      {/* Preview Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-sm">
        {/* Color Header */}
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: color }}
        />

        <div className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-slate-200"
              style={{ 
                backgroundColor: `${color}20`,
              }}
            >
              <Tag 
                className="w-5 h-5" 
                style={{ color: color }}
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {displayName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">Cor:</span>
            <code 
              className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold shadow-sm"
              style={{ 
                backgroundColor: color,
                color: getContrastColor(color)
              }}
            >
              {color}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};