"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const LoginPage = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const TEMPO_LOGIN = 700;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      name: name,
      password: password,
    };

    try {
      const result = await signIn("credentials", {
        ...data,
        callbackUrl: "/journalist/posts",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas. Tente novamente");
        return;
      }

      toast.success("Logado com sucesso!");

      setTimeout(() => router.push("/journalist"), TEMPO_LOGIN);
    } catch (err) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image com overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/image.png"
          alt="Background"
          fill
          quality={75}
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay com efeito de vidro */}
        <div className="absolute inset-0 bg-linear-to-br from-black/40 via-transparent to-black/40" />
      </div>

      {/* Container do formulário - Muito mais largo para desktop */}
      <div className="relative z-10 w-full max-w-5xl px-2 md:px-8">
        {/* Card de Login com design assimétrico */}
        <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Barra lateral colorida */}
            <div className="bg-linear-to-br from-[#dc2626] to-[#f59e0b] p-8 lg:p-16 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="w-23 h-23 p-2 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                  <Image
                    src={"/images/logo.png"}
                    alt="Logo"
                    width={90}
                    height={90}
                  ></Image>
                </div>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Bem-vindo
                  </h2>
                  <p className="text-white/90 text-lg lg:text-xl">
                    Entre com suas credenciais para acessar o sistema
                  </p>
                </div>
                {/* Decoração */}
                <div className="hidden lg:block space-y-4 pt-12">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="h-0.5 flex-1 bg-white/40"></div>
                  </div>
                  <div className="flex items-center space-x-3 pl-4">
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="h-0.5 flex-1 bg-white/40"></div>
                  </div>
                  <div className="flex items-center space-x-3 pl-8">
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="h-0.5 flex-1 bg-white/40"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-8 lg:p-16">
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Fazer Login
                  </h1>
                  <p className="text-gray-500">Preencha os campos abaixo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo Nome */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Nome de Usuário
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all outline-none text-gray-700 placeholder:text-gray-400"
                        placeholder="Digite seu nome de usuário"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Senha */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Senha
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                        <svg
                          className="h-5 w-5 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all outline-none text-gray-700 placeholder:text-gray-400"
                        placeholder="Digite sua senha"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e3a8a] text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Entrando...
                      </span>
                    ) : (
                      "Entrar no Sistema"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
