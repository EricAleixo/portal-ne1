export const dynamic = "force-dynamic";

import { userService } from "@/app/_services/user.service";
import { UserPlus, ArrowLeft, CircleAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { UserForm } from "@/app/_components/organisms/UserForm";

export default function NewUserPage() {
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!name || !password) {
      throw new Error("Nome e senha são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    await userService.create(name, password);
    revalidatePath("/users");
    redirect("/users");
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
                Novo Usuário
              </h1>
              <p className="text-sm text-gray-600 font-semibold mt-1">
                Cadastre um novo usuário no sistema
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Criar Novo Usuário
                </h2>
                <p className="text-white/80 font-semibold text-sm mt-1">
                  Preencha os dados abaixo
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <UserForm action={createUser} cancelUrl="/users" />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase text-blue-900 mb-3 flex items-center gap-2">
            <CircleAlert /> Informações Importantes
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 font-semibold">
            <li>• A senha deve ter no mínimo 6 caracteres</li>
            <li>• Jornalistas podem criar e editar posts</li>
            <li>• Administradores têm acesso total ao sistema</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
