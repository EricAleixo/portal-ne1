'use client';
import { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from '../molecules/SearchBar';
import { UserCard } from '../molecules/UserCards';

type UserRole = "ADMIN" | "JOURNALIST";

interface UserListProps {
  users: Array<{
    id: number;
    name: string;
    role: UserRole;
  }>;
  onDelete: (formData: FormData) => Promise<void>;
}

export const UserList = ({ users, onDelete }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={setSearchTerm} />
        <Link
          href="/users/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </Link>
      </div>

      {/* Lista de usuários */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">
            {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </p>
          {searchTerm && (
            <p className="text-sm text-slate-400 mt-2">
              Tente ajustar os termos de busca
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};