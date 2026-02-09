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
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/app/_components/atoms/Badge";
import Link from "next/link";
import Image from "next/image";
import { TiptapEditor } from "../atoms/TipTapEditor";
import { PasswordModal } from "../organisms/PasswordModal";

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: FormData, password: string) => Promise<void>;
  onCancel?: () => void;
  categories?: Array<{ id: number; name: string; color: string }>;
  mode: "create" | "edit";
  submitButtonText?: string;
}

export interface PostFormData {
  title: string;
  description: string;
  tags: string[];
  photo: File | null;
  photoUrl: string | null;
  categoryId: number | string;
  content: string;
  published: boolean;
}

const MAX_TAGS = 10;

const DEFAULT_FORM_DATA: PostFormData = {
  title: "",
  description: "",
  tags: [],
  photo: null,
  photoUrl: null,
  categoryId: "",
  content: "",
  published: true,
};

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  categories = [],
  mode,
  submitButtonText,
}) => {
  const [formData, setFormData] = useState<PostFormData>(
    initialData || DEFAULT_FORM_DATA
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photoUrl || null
  );
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    initialData?.photoUrl ? "url" : "upload"
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs para evitar re-renders durante digitação
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const photoUrlRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // Handle input changes - agora sem setState imediato
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    
    // Limpar erro se existir
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

    if (/^[a-zA-Z0-9\s]*$/.test(value)) {
      setTagInput(value);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

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

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          photo: "Por favor, selecione uma imagem válida",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "A imagem deve ter no máximo 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file, photoUrl: null }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.photo) {
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handlePhotoUrlBlur = () => {
    const url = photoUrlRef.current?.value || "";
    
    setFormData((prev) => ({ ...prev, photoUrl: url, photo: null }));

    if (url) {
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null, photoUrl: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (photoUrlRef.current) {
      photoUrlRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Pegar valores das refs
    const title = titleRef.current?.value || "";
    const description = descriptionRef.current?.value || "";
    const photoUrl = photoUrlRef.current?.value || "";
    const content = editorRef.current?.getContent() || "";

    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    } else if (title.length > 255) {
      newErrors.title = "O título deve ter no máximo 255 caracteres";
    }

    if (!description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (description.length > 500) {
      newErrors.description = "A descrição deve ter no máximo 500 caracteres";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Selecione uma categoria";
    }

    if (!content.trim() || content === '<p></p>') {
      newErrors.content = "O conteúdo é obrigatório";
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Adicione pelo menos uma tag";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordConfirm = async (password: string) => {
    setShowPasswordModal(false);
    setIsSubmitting(true);

    const submitData = new FormData();
    
    // Pegar valores das refs para submissão
    submitData.append("title", titleRef.current?.value || "");
    submitData.append("description", descriptionRef.current?.value || "");
    submitData.append("content", editorRef.current?.getContent() || "");
    submitData.append("tags", JSON.stringify(formData.tags));
    submitData.append("categoryId", String(formData.categoryId));
    submitData.append("published", String(formData.published));

    if (formData.photo) {
      submitData.append("photoFile", formData.photo);
    } else if (photoUrlRef.current?.value) {
      submitData.append("photoUrl", photoUrlRef.current.value);
    }

    try {
      await onSubmit(submitData, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setShowPasswordModal(true);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const title = mode === "create" ? "Nova Postagem" : "Editar Postagem";
  const buttonText =
    submitButtonText ||
    (mode === "create" ? "Salvar Postagem" : "Atualizar Postagem");
  
  // Encontrar a categoria selecionada para usar na pré-visualização
  const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));

  return (
    <>
      <article className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 relative">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-200/50 bg-linear-to-r from-blue-50/30 via-purple-50/20 to-green-50/30">
          <div className="flex items-center gap-3">
            <Image
              src={"/images/logo.png"}
              alt="Logo portal"
              width={40}
              height={40}
            />
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent h-11">
              {title}
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
              ref={titleRef}
              type="text"
              id="title"
              name="title"
              defaultValue={formData.title}
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
              ref={descriptionRef}
              id="description"
              name="description"
              defaultValue={formData.description}
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
              {descriptionRef.current?.value.length || 0}/500 caracteres
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
              <div className="relative">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
                    if (errors.categoryId) {
                      setErrors((prev) => ({ ...prev, categoryId: "" }));
                    }
                  }}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border ${
                    errors.categoryId
                      ? "border-red-300 bg-red-50/50"
                      : "border-gray-200/60 bg-white/50"
                  } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583] transition-all duration-200 appearance-none cursor-pointer font-medium`}
                  style={{
                    backgroundImage: formData.categoryId 
                      ? `linear-gradient(to right, ${selectedCategory?.color}10, transparent)`
                      : 'none'
                  }}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                
                {/* Indicador de cor da categoria selecionada */}
                {formData.categoryId && selectedCategory && (
                  <div 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md border-2 border-white"
                    style={{ 
                      backgroundColor: selectedCategory.color 
                    }}
                  />
                )}
                
                {/* Ícone dropdown customizado */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.categoryId && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <CircleAlert className="h-6 w-6" /> {errors.categoryId}
                </p>
              )}
              
              {/* Preview da categoria selecionada */}
              {formData.categoryId && selectedCategory && (
                <div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg border border-gray-200/60">
                  <span className="text-xs text-gray-500 font-semibold">Pré-visualização:</span>
                  <span 
                    className="inline-block px-3 py-1.5 text-xs font-black uppercase tracking-wide rounded-lg shadow-sm"
                    style={{
                      backgroundColor: selectedCategory.color,
                      color: 'white'
                    }}
                  >
                    {selectedCategory.name}
                  </span>
                </div>
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
                      ✓ {mode === "create" ? "Publicar imediatamente" : "Publicado"}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      {mode === "create" ? "Salvar como rascunho" : "Rascunho"}
                    </span>
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

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setImageInputMode("upload");
                  setFormData((prev) => ({ ...prev, photoUrl: null }));
                  if (photoUrlRef.current) {
                    photoUrlRef.current.value = "";
                  }
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
                <Image
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                  width={256}
                  height={256}
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
                      ref={photoUrlRef}
                      type="url"
                      defaultValue={formData.photoUrl ?? ""}
                      onChange={handlePhotoUrlChange}
                      onBlur={handlePhotoUrlBlur}
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

          {/* Tiptap Editor */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-[#283583]" />
              Conteúdo
            </label>

            <TiptapEditor
              ref={editorRef}
              content={formData.content}
              onChange={() => {
                // Limpar erro se existir
                if (errors.content) {
                  setErrors((prev) => ({ ...prev, content: "" }));
                }
              }}
              error={errors.content}
            />

            {errors.content && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <CircleAlert className="h-6 w-6" /> {errors.content}
              </p>
            )}
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Lightbulb className="h-4 w-4" /> Use a barra de ferramentas para
              formatar seu texto - negrito, itálico, títulos, listas e muito
              mais
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-linear-to-r from-[#5FAD56] to-[#4a9144] hover:from-[#4a9144] hover:to-[#5FAD56] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Salvando..." : buttonText}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-6 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                showPreview
                  ? "bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  : "bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2860] hover:to-[#283583] text-white"
              } hover:scale-105 hover:shadow-3xl`}
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  <span>Fechar Preview</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span>Ver Preview</span>
                </>
              )}
            </button>
            <Link
              href={"/journalist/posts"}
              onClick={handleCancel}
              className="flex-1 sm:flex-none bg-white/50 backdrop-blur-sm border border-gray-300/60 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </Link>
          </div>
        </form>
      </article>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-111111111 flex items-center justify-center p-4 animate-fadeIn">
          <div className=" rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#283583] to-[#3d4ba8] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Eye className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Pré-visualização do Post</h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="bg-white p-8 overflow-y-auto max-h-[calc(90vh-88px)]">
              {/* Preview as Blog Post */}
              <article className="max-w-3xl mx-auto">
                {/* Featured Image */}
                {photoPreview && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={photoPreview}
                      alt={titleRef.current?.value || "Preview"}
                      className="w-full h-96 object-cover"
                      width={800}
                      height={400}
                    />
                  </div>
                )}

                {/* Category Badge */}
                {formData.categoryId && selectedCategory && (
                  <div className="mb-4">
                    <span 
                      className="inline-block px-5 py-2.5 text-sm font-black uppercase tracking-wider shadow-lg rounded-lg"
                      style={{
                        backgroundColor: selectedCategory.color,
                        color: 'white'
                      }}
                    >
                      {selectedCategory.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {titleRef.current?.value || "Sem título"}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      formData.published ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.published ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span className="font-medium">
                      {formData.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium border-l-4 border-[#283583] pl-6 italic">
                  {descriptionRef.current?.value || "Sem descrição"}
                </p>

                {/* Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full border border-gray-300 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      editorRef.current?.getContent() ||
                      '<p class="text-gray-500 italic">Sem conteúdo</p>',
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Password Confirmation Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onConfirm={handlePasswordConfirm}
        onCancel={() => setShowPasswordModal(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};