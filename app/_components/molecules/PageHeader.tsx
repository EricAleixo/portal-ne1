// app/_components/common/PageHeader.tsx
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
              </div>
              {description && (
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};