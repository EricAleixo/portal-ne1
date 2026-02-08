// app/(journalist)/profile/page.tsx
import { getSessionOrThrow } from "@/app/api/_utils/session";
import { JournalistLayout } from "../layouts/JournalistLayout";
import { userService } from "@/app/_services/user.service";
import { notFound } from "next/navigation";
import { ProfilePhotoUpload } from "../organisms/ProfilePhotoUpload";
import { Calendar, CheckCircle2, XCircle, Mail, Shield, User } from "lucide-react";

export const ProfilePage = async () => {
  const session = await getSessionOrThrow();
  
  if (!session.user.name) {
    notFound();
  }
  
  const user = await userService.findByName(session.user.name);
  
  if (!user) {
    notFound();
  }

  return (
    <JournalistLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header com gradiente */}
        <div className="relative bg-linear-to-br from-[#283583] via-[#3d4ba8] to-[#283583] rounded-2xl overflow-hidden shadow-2xl">
          {/* Efeitos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5FAD56]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C4161C]/10 rounded-full blur-3xl" />
          
          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Upload de foto */}
              <ProfilePhotoUpload
                initialPhoto={user.photoProfile || "/avatar-placeholder.png"}
                userName={user.name}
                userId={user.id}
              />
              
              {/* Informações principais */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
                  {user.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-bold text-sm">
                    <Shield className="w-4 h-4" />
                    {user.role}
                  </span>
                  
                  <span 
                    className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-lg font-bold text-sm ${
                      user.actived 
                        ? 'bg-[#5FAD56]/20 text-white' 
                        : 'bg-red-500/20 text-white'
                    }`}
                  >
                    {user.actived ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Conta Ativa
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Conta Inativa
                      </>
                    )}
                  </span>
                </div>
                
                <p className="text-white/90 font-medium">
                  Membro desde {user.createdAt && new Date(user.createdAt).toLocaleDateString("pt-BR", { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card de Informações Pessoais */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#283583]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#283583] to-[#3d4ba8] flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Dados Pessoais
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <label className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1 block">
                  Nome Completo
                </label>
                <p className="text-lg font-bold text-gray-900">{user.name}</p>
              </div>
              
              
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1 block">
                  Função
                </label>
                <p className="text-lg font-bold text-gray-900">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Card de Status da Conta */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#C4161C]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#C4161C] to-[#e01b22] flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Informações da Conta
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <label className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1 block">
                  Status da Conta
                </label>
                <div className="flex items-center gap-2">
                  {user.actived ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-[#5FAD56] animate-pulse shadow-lg shadow-green-500/50" />
                      <span className="text-lg font-bold text-[#5FAD56]">Ativa</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                      <span className="text-lg font-bold text-red-600">Inativa</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="pb-4 border-b border-gray-100">
                <label className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1 block">
                  Data de Criação
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {user.createdAt && new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-gray-500 mb-1 block">
                  ID do Usuário
                </label>
                <p className="text-lg font-bold text-gray-900 font-mono">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </JournalistLayout>
  );
};