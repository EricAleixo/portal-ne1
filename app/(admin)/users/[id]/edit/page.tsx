import { userService } from '@/app/_services/user.service';
import { Edit, ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { UserForm } from '@/app/_components/organisms/UserForm';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  let user;
  try {
    user = await userService.findById(userId);
  } catch (error) {
    notFound();
  }

  async function updateUser(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'ADMIN' | 'JOURNALIST';

    const updateData: { name?: string; password?: string; role?: 'ADMIN' | 'JOURNALIST' } = {};

    if (name) updateData.name = name;
    if (password) {
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      updateData.password = password;
    }
    if (role) updateData.role = role;

    try {
      await userService.update(userId, updateData);
      revalidatePath('/users');
      redirect('/users');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-[#283583] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/users"
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                Editar Usuário
              </h1>
              <p className="text-sm text-gray-600 font-semibold mt-1">
                Atualize as informações do usuário
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
          {/* Card Header */}
          <div className="bg-linear-to-br from-[#283583] to-[#3d4ba8] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Editar: {user.name}
                </h2>
                <p className="text-white/80 font-semibold text-sm mt-1">
                  ID: #{user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <UserForm 
              user={user} 
              action={updateUser} 
              cancelUrl="/users" 
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase text-yellow-900 mb-3">
            <CircleAlert></CircleAlert> Atenção
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800 font-semibold">
            <li>• Deixe o campo de senha em branco para manter a senha atual</li>
            <li>• Alterar a função do usuário pode afetar suas permissões</li>
            <li>• Mudanças são aplicadas imediatamente após salvar</li>
          </ul>
        </div>
      </main>
    </div>
  );
}