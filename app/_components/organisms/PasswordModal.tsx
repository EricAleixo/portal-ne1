"use client"

import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

// Modal de Confirmação de Senha
interface PasswordModalProps {
    isOpen: boolean;
    onConfirm: (password: string) => void;
    onCancel: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password.trim()) {
            setError('A senha é obrigatória');
            return;
        }

        onConfirm(password);
        setPassword('');
        setError('');
    };

    const handleCancel = () => {
        setPassword('');
        setError('');
        setShowPassword(false);
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-200/50">
                <div className="bg-linear-to-r from-blue-50/30 via-purple-50/20 to-green-50/30 p-6 border-b border-gray-200/50">
                    <h3 className="text-xl font-bold text-gray-900">Confirmar Publicação</h3>
                    <p className="text-sm text-gray-600 mt-1">Digite sua senha para confirmar</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                                    error 
                                        ? 'border-red-300 bg-red-50/50' 
                                        : 'border-gray-200/60 bg-white/50'
                                } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200`}
                                placeholder="Digite sua senha"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm flex items-center gap-1">
                                <span className="font-medium">⚠</span> {error}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#3d4ba8] hover:to-[#283583] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Confirmar
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-white/50 backdrop-blur-sm border border-gray-300/60 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};