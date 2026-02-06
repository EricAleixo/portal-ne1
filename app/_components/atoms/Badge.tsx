import React from 'react';
import { X } from 'lucide-react';

interface BadgeProps {
    children: React.ReactNode;
    onRemove?: () => void;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
    children, 
    onRemove, 
    variant = 'default',
    className = '' 
}) => {
    const variantStyles = {
        default: '',
        primary: 'bg-linear-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 border-blue-200/50',
        success: 'bg-linear-to-r from-green-100/80 to-emerald-100/80 text-green-700 border-green-200/50',
        warning: 'bg-linear-to-r from-amber-100/80 to-orange-100/80 text-amber-700 border-amber-200/50',
        danger: 'bg-linear-to-r from-red-100/80 to-pink-100/80 text-red-700 border-red-200/50',
    };

    return (
        <span 
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${variantStyles[variant]} ${className}`}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                    aria-label="Remover tag"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
};