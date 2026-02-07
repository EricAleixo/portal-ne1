"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Save,
  X,
  Image as ImageIcon,
  Calendar,
  Tag as TagIcon,
  AlignLeft,
  Upload,
  Trash2,
  Link as LinkIcon,
  CircleAlert,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/app/_components/atoms/Badge";
import dynamic from "next/dynamic";
import { PasswordModal } from "./PasswordModal";
import Link from "next/link";
import { postService } from "@/services/posts.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Editor WYSIWYG para Markdown
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

interface CreatePostProps {
  onCancel?: () => void;
  categories?: Array<{ id: number; name: string; color: string }>;
}

export interface PostFormData {
  title: string;
  description: string;
  tags: string[];
  photo: File | null;
  photoUrl: string;
  categoryId: string;
  content: string;
  published: boolean;
}

const MAX_TAGS = 10;

export const CreatePost: React.FC<CreatePostProps> = ({
  onCancel,
  categories = [],
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    tags: [],
    photo: null,
    photoUrl: "",
    categoryId: "",
    content: "",
    published: true,
  });

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    "upload",
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Se houver múltiplos espaços (indicando cola), processa diretamente
    if (value.includes("  ") || value.split(" ").length > 2) {
      const tags = value
        .split(" ")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t && !formData.tags.includes(t))
        .slice(0, MAX_TAGS - formData.tags.length);

      if (tags.length > 0) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, ...tags].slice(0, MAX_TAGS),
        }));
        setTagInput("");
      }
      return;
    }

    // Permite apenas letras, números e espaços
    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setTagInput(value);
    }
  };

  // Add tag on space or enter
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Add tag
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();

    if (
      tag &&
      !formData.tags.includes(tag) &&
      formData.tags.length < MAX_TAGS
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  // Handle paste event for tags
  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const tags = pastedText
      .split(/[\s,]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !formData.tags.includes(t))
      .slice(0, MAX_TAGS - formData.tags.length);

    if (tags.length > 0) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, ...tags].slice(0, MAX_TAGS),
      }));
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Por favor, selecione uma imagem válida",
        }));
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "A imagem deve ter no máximo 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file, photoUrl: "" }));

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Limpar erro
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  // Handle URL input change
  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoUrl: url, photo: null }));

    if (url) {
      setPhotoPreview(url);
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    } else {
      setPhotoPreview(null);
    }
  };

  // Remove photo
  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null, photoUrl: "" }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if(newErrors){
        toast.error("Erro ao contabilizar dados, verifique se os campos estão corretos!")
    }

    if (!formData.title.trim()) {
      newErrors.title = "O título é obrigatório";
    } else if (formData.title.length > 255) {
      newErrors.title = "O título deve ter no máximo 255 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (formData.description.length > 500) {
      newErrors.description = "A descrição deve ter no máximo 500 caracteres";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Selecione uma categoria";
    }

    if (!formData.content.trim()) {
      newErrors.content = "O conteúdo é obrigatório";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Adicione pelo menos uma tag";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password confirmation
  const handlePasswordConfirm = async (password: string) => {
    setShowPasswordModal(false);

    // Criar FormData para enviar ao backend
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("content", formData.content);
    submitData.append("tags", JSON.stringify(formData.tags));
    submitData.append("categoryId", formData.categoryId);
    submitData.append("published", String(formData.published));
    submitData.append("password", password);

    // Adicionar foto (file ou URL)
    if (formData.photo) {
      submitData.append("photoFile", formData.photo);
    } else if (formData.photoUrl) {
      submitData.append("photoUrl", formData.photoUrl);
    }

    try {
      const post = await postService.create(submitData);

      toast.success(`${post.title} postado com sucesso!`)

      setTimeout(()=> router.push("/journalist"), 1500)

    } catch (error) {
      toast.error("Senha inválida!");
    }
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setShowPasswordModal(true);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <>
      <article className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-200/50 bg-linear-to-r from-blue-50/30 via-purple-50/20 to-green-50/30">
          <div className="flex items-center gap-3">
            <Image src={"/images/logo.png"} alt="Logo portal" width={40} height={40}></Image>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent h-11">
              Nova Postagem
            </h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <AlignLeft className="w-4 h-4 text-[#283583]" />
              Título da Postagem
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title
                  ? "border-red-300 bg-red-50/50"
                  : "border-gray-200/60 bg-white/50"
              } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200`}
              placeholder="Digite um título atraente para seu post..."
            />
            {errors.title && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <CircleAlert className="h-6 w-6" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <FileText className="w-4 h-4 text-[#283583]" />
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description
                  ? "border-red-300 bg-red-50/50"
                  : "border-gray-200/60 bg-white/50"
              } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200 resize-y`}
              placeholder="Escreva uma breve descrição do post..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <CircleAlert className="h-6 w-6" /> {errors.description}
              </p>
            )}
            <p className="text-gray-500 text-sm">
              {formData.description.length}/500 caracteres
            </p>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="flex items-center justify-between text-sm font-semibold text-gray-700"
            >
              <span className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#283583]" />
                Tags
              </span>
              <span className="text-xs font-normal text-gray-500">
                {formData.tags.length}/{MAX_TAGS}
              </span>
            </label>
            <div className="space-y-3">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onPaste={handleTagPaste}
                onBlur={addTag}
                disabled={formData.tags.length >= MAX_TAGS}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.tags
                    ? "border-red-300 bg-red-50/50"
                    : formData.tags.length >= MAX_TAGS
                      ? "border-gray-200/60 bg-gray-100/50 cursor-not-allowed"
                      : "border-gray-200/60 bg-white/50"
                } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200`}
                placeholder={
                  formData.tags.length >= MAX_TAGS
                    ? `Limite de ${MAX_TAGS} tags atingido`
                    : "Digite ou cole tags (separe por espaço ou Enter)..."
                }
              />
              {errors.tags && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <CircleAlert className="h-6 w-6" /> {errors.tags}
                </p>
              )}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      onRemove={() => removeTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category and Published Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label
                htmlFor="categoryId"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <TagIcon className="w-4 h-4 text-[#283583]" />
                Categoria
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.categoryId
                    ? "border-red-300 bg-red-50/50"
                    : "border-gray-200/60 bg-white/50"
                } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <CircleAlert className="h-6 w-6" /> {errors.categoryId}
                </p>
              )}
            </div>

            {/* Published Checkbox */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-[#283583]" />
                Status
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200/60 bg-white/50 backdrop-blur-sm">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-[#283583] bg-white border-gray-300 rounded focus:ring-2 focus:ring-[#283583]/20 cursor-pointer"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  {formData.published ? (
                    <span className="font-medium text-green-600">
                      ✓ Publicar imediatamente
                    </span>
                  ) : (
                    <span className="text-gray-600">Salvar como rascunho</span>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Photo Upload/URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon className="w-4 h-4 text-[#283583]" />
              Imagem de Destaque
            </label>

            {/* Toggle between upload and URL */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setImageInputMode("upload");
                  setFormData((prev) => ({ ...prev, photoUrl: "" }));
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  imageInputMode === "upload"
                    ? "bg-[#283583] text-white shadow-md"
                    : "bg-white/50 text-gray-600 border border-gray-200/60 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-4 h-4 inline-block mr-2" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageInputMode("url");
                  setFormData((prev) => ({ ...prev, photo: null }));
                  setPhotoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  imageInputMode === "url"
                    ? "bg-[#283583] text-white shadow-md"
                    : "bg-white/50 text-gray-600 border border-gray-200/60 hover:bg-gray-50"
                }`}
              >
                <LinkIcon className="w-4 h-4 inline-block mr-2" />
                URL
              </button>
            </div>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200/60 bg-white/50 backdrop-blur-sm">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                  onError={() => {
                    setErrors((prev) => ({
                      ...prev,
                      photo: "Erro ao carregar imagem. Verifique a URL.",
                    }));
                    setPhotoPreview(null);
                  }}
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                  aria-label="Remover imagem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {imageInputMode === "upload" ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300/60 rounded-xl p-8 text-center bg-white/30 backdrop-blur-sm hover:border-[#283583]/40 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-xl bg-linear-to-br from-blue-100/50 to-indigo-100/50 border border-blue-200/30 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#283583]" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        Clique para fazer upload
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG ou WEBP (máx. 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={handlePhotoUrlChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200/60 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" /> Cole a URL completa de
                      uma imagem
                    </p>
                  </div>
                )}
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {errors.photo && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <CircleAlert className="h-6 w-6" /> {errors.photo}
              </p>
            )}
          </div>

          {/* Markdown Editor WYSIWYG */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-[#283583]" />
              Conteúdo
            </label>

            <div
              className={`rounded-xl overflow-hidden border ${
                errors.content ? "border-red-300" : "border-gray-200/60"
              }`}
              data-color-mode="light"
            >
              <MDEditor
                value={formData.content}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, content: value || "" }));
                  if (errors.content) {
                    setErrors((prev) => ({ ...prev, content: "" }));
                  }
                }}
                preview="edit"
                hideToolbar={false}
                height={500}
                visibleDragbar={false}
                enableScroll={true}
              />
            </div>

            {errors.content && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <CircleAlert className="h-6 w-6" /> {errors.content}
              </p>
            )}
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Lightbulb className="h-4 w-4" /> Digite normalmente - a
              formatação Markdown é aplicada automaticamente enquanto você
              escreve
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
            <button
              type="submit"
              className="flex-1 bg-linear-to-r from-[#5FAD56] to-[#4a9144] hover:from-[#4a9144] hover:to-[#5FAD56] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Postagem</span>
            </button>
            <Link
              href={"/journalist"}
              onClick={handleCancel}
              className="flex-1 sm:flex-none bg-white/50 backdrop-blur-sm border border-gray-300/60 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </Link>
          </div>
        </form>
      </article>

      {/* Password Confirmation Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onConfirm={handlePasswordConfirm}
        onCancel={() => setShowPasswordModal(false)}
      />
    </>
  );
};
