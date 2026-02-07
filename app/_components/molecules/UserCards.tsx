import { User, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteUserButton } from './DeleteUserButton';

type UserRole = "ADMIN" | "JOURNALIST";

interface UserCardProps {
  user: {
    id: number;
    name: string;
    role: UserRole;
  };
  onDelete: (formData: FormData) => Promise<void>;
}

export const UserCard = ({ user, onDelete }: UserCardProps) => {
  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-200/50',
      JOURNALIST: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200/50'
    };

    const labels = {
      ADMIN: 'Administrador',
      JOURNALIST: 'Jornalista'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-md ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-200 hover:border-indigo-200 group">
      {/* Card Header */}
      <div className="bg-linear-to-br from-slate-50 to-slate-100/50 p-5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200/50 group-hover:scale-105 transition-transform duration-200">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate mb-2">
              {user.name}
            </h3>
            {getRoleBadge(user.role)}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-3 flex gap-2 bg-slate-50/50">
        <Link
          href={`/users/${user.id}/edit`}
          className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-indigo-200/50 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Link>
        <DeleteUserButton userId={user.id} onDelete={onDelete} />
      </div>
    </div>
  );
};