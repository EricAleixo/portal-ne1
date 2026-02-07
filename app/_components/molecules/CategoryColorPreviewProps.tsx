// app/_components/categorias/CategoryColorPreview.tsx
interface CategoryColorPreviewProps {
  color: string;
}

export const CategoryColorPreview = ({ color }: CategoryColorPreviewProps) => {
  return (
    <div 
      className="w-8 h-8 rounded-full border-2 border-white shadow-md shrink-0"
      style={{ backgroundColor: color }}
      title={color}
    />
  );
};