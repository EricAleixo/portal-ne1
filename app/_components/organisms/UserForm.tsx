import { User, Lock, Shield, Save, X, NotebookPen } from 'lucide-react';
import Link from 'next/link';

type UserRole = "ADMIN" | "JOURNALIST";

interface UserFormProps {
  user?: {
    id: number;
    name: string;
    role: UserRole;
  };
  action: (formData: FormData) => Promise<void>;
  cancelUrl: string;
}

export const UserForm = ({ user, action, cancelUrl }: UserFormProps) => {
  return (
    <form action={action} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <label 
          htmlFor="name" 
          className="block text-sm font-semibold text-slate-700"
        >
          Nome do Usuário
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user?.name}
            required
            className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
            placeholder="Digite o nome do usuário"
          />
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-semibold text-slate-700"
        >
          {user ? 'Nova Senha' : 'Senha'}
          {user && <span className="text-slate-400 font-normal ml-1">(opcional)</span>}
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            minLength={6}
            required={!user}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400"
            placeholder={user ? 'Deixe em branco para manter a atual' : 'Mínimo de 6 caracteres'}
          />
        </div>
        {!user && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            Mínimo de 6 caracteres
          </p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label 
          htmlFor="role" 
          className="block text-sm font-semibold text-slate-700"
        >
          Função
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <NotebookPen className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
          <select
            id="role"
            name="role"
            defaultValue={'JOURNALIST'}
            disabled
            className="w-full pl-11 pr-10 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-400 appearance-none bg-white cursor-pointer"
          >
            <option value="JOURNALIST">Jornalista</option>
          </select>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-6 border-t border-slate-200">
        <Link
          href={cancelUrl}
          className="flex-1 px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <X className="w-4 h-4" />
          Cancelar
        </Link>
        <button
          type="submit"
          className="flex-1 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200/50 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          {user ? 'Atualizar' : 'Criar Usuário'}
        </button>
      </div>
    </form>
  );
};