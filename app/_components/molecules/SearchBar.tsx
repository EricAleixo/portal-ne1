// app/_components/molecules/SearchBar.tsx
'use client';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
      />
    </div>
  );
};