"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import ImageResize from "tiptap-extension-resize-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  Minus,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import {
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  error?: string;
}

export interface TiptapEditorRef {
  getContent: () => string;
}

const MenuButton = ({
  onClick,
  isActive = false,
  children,
  title,
  disabled = false,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive ? "bg-[#283583] text-white hover:bg-[#1e2860]" : "text-gray-700"
    }`}
  >
    {children}
  </button>
);

// Modal de Upload de Imagem
const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}) => {
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      setIsUploading(true);
      try {
        await onUpload(imageFile);
        onClose();
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      try {
        await onUpload(file);
        onClose();
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      // Criar um "pseudo-arquivo" para URLs
      const blob = new Blob([imageUrl], { type: "text/plain" });
      const file = new File([blob], "image-url.txt", { type: "text/plain" });
      
      // Passar a URL diretamente ao editor
      onClose();
      // Callback será tratado no componente pai
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        setIsUploading(true);
        try {
          await onUpload(file);
          onClose();
        } catch (error) {
          console.error("Erro ao fazer upload:", error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-linear-to-r from-[#283583] to-[#3d4ba8] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <ImageIcon className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Inserir Imagem</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUploadMode("upload")}
              disabled={isUploading}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                uploadMode === "upload"
                  ? "bg-[#283583] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              Upload / Colar
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              disabled={isUploading}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                uploadMode === "url"
                  ? "bg-[#283583] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Link2 className="w-5 h-5 inline-block mr-2" />
              URL
            </button>
          </div>

          {/* Upload Area */}
          {uploadMode === "upload" ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onPaste={handlePaste}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
                dragActive
                  ? "border-[#283583] bg-blue-50"
                  : "border-gray-300 hover:border-[#283583] hover:bg-gray-50"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-[#283583] animate-spin" />
                  <p className="text-gray-600 font-medium">
                    Fazendo upload...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 border border-blue-200">
                    <Upload className="w-8 h-8 text-[#283583]" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold text-lg mb-1">
                      Clique, arraste ou cole uma imagem
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, WEBP ou GIF (máx. 5MB)
                    </p>
                  </div>
                  <div className="mt-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700 text-sm font-medium">
                      Dica: Use Ctrl+V para colar imagens copiadas
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#283583]/20 focus:border-[#283583]"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim() || isUploading}
                className="w-full px-6 py-3 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2860] hover:to-[#283583] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Inserir Imagem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, error }, ref) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const isInitialMount = useRef(true);
    const onChangeRef = useRef(onChange);

    // Atualizar ref do onChange sem causar re-render
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Função para fazer upload de imagem para o S3
    const uploadImageToS3 = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload da imagem");
      }

      const data = await response.json();
      return data.url; // URL da imagem no S3
    };

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline hover:text-blue-800",
          },
        }),
        ImageResize,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder: "Comece a escrever sua matéria...",
        }),
      ],
      content,
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4",
        },
        handlePaste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          const imageItem = items.find((item) => item.type.startsWith("image/"));

          if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();

            if (file) {
              uploadImageToS3(file)
                .then((url) => {
                  editor
                    ?.chain()
                    .focus()
                    .setImage({ src: url })
                    .run();
                })
                .catch((error) => {
                  console.error("Erro ao fazer upload da imagem:", error);
                  alert("Erro ao fazer upload da imagem. Tente novamente.");
                });
            }

            return true;
          }

          return false;
        },
        handleDrop: (view, event, slice, moved) => {
          if (!moved && event.dataTransfer?.files.length) {
            const files = Array.from(event.dataTransfer.files);
            const imageFile = files.find((file) =>
              file.type.startsWith("image/")
            );

            if (imageFile) {
              event.preventDefault();

              uploadImageToS3(imageFile)
                .then((url) => {
                  const { schema } = view.state;
                  const coordinates = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                  });

                  if (coordinates) {
                    const node = schema.nodes.image.create({ src: url });
                    const transaction = view.state.tr.insert(
                      coordinates.pos,
                      node
                    );
                    view.dispatch(transaction);
                  }
                })
                .catch((error) => {
                  console.error("Erro ao fazer upload da imagem:", error);
                  alert("Erro ao fazer upload da imagem. Tente novamente.");
                });

              return true;
            }
          }

          return false;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChangeRef.current(html);
      },
    });

    // Expor método para pegar conteúdo via ref
    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editor?.getHTML() || "";
      },
    }));

    // Atualizar editor apenas quando o conteúdo inicial mudar
    useEffect(() => {
      if (editor && isInitialMount.current) {
        const currentContent = editor.getHTML();
        const normalizedCurrent = currentContent
          .replace(/<p><\/p>/g, "")
          .trim();
        const normalizedNew = content.replace(/<p><\/p>/g, "").trim();

        if (normalizedNew && normalizedCurrent !== normalizedNew) {
          editor.commands.setContent(content);
        }
        isInitialMount.current = false;
      }
    }, [editor, content]);

    const setLink = useCallback(() => {
      if (!editor) return;

      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL do link:", previousUrl);

      if (url === null) return;

      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }, [editor]);

    const handleImageUpload = async (file: File) => {
      if (!editor) return;

      try {
        const url = await uploadImageToS3(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        alert("Erro ao fazer upload da imagem. Tente novamente.");
      }
    };

    if (!editor) {
      return null;
    }

    return (
      <>
        <div
          className={`rounded-xl overflow-hidden border ${
            error ? "border-red-300" : "border-gray-200/60"
          } bg-white/50 backdrop-blur-sm`}
        >
          {/* Toolbar */}
          <div className="border-b border-gray-200/60 bg-linear-to-r from-gray-50/80 via-white/80 to-gray-50/80 backdrop-blur-sm p-3 sticky top-0 z-10">
            <div className="flex flex-wrap gap-1">
              {/* Undo/Redo */}
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <MenuButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  title="Desfazer (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  title="Refazer (Ctrl+Y)"
                >
                  <Redo className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Headings */}
              <div className="flex gap-1 px-2 border-r border-gray-300">
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 1 })}
                  title="Título 1"
                >
                  <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 2 })}
                  title="Título 2"
                >
                  <Heading2 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 3 })}
                  title="Título 3"
                >
                  <Heading3 className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Text Formatting */}
              <div className="flex gap-1 px-2 border-r border-gray-300">
                <MenuButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                  title="Negrito (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  title="Itálico (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive("underline")}
                  title="Sublinhado (Ctrl+U)"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive("strike")}
                  title="Tachado"
                >
                  <Strikethrough className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Lists */}
              <div className="flex gap-1 px-2 border-r border-gray-300">
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                  title="Lista com marcadores"
                >
                  <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor.isActive("orderedList")}
                  title="Lista numerada"
                >
                  <ListOrdered className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Alignment */}
              <div className="flex gap-1 px-2 border-r border-gray-300">
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                  title="Alinhar à esquerda"
                >
                  <AlignLeft className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                  title="Centralizar"
                >
                  <AlignCenter className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                  title="Alinhar à direita"
                >
                  <AlignRight className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Quote & Code */}
              <div className="flex gap-1 px-2 border-r border-gray-300">
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                  title="Citação"
                >
                  <Quote className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                  }
                  isActive={editor.isActive("codeBlock")}
                  title="Bloco de código"
                >
                  <Code className="w-4 h-4" />
                </MenuButton>
              </div>

              {/* Link & Image */}
              <div className="flex gap-1 px-2">
                <MenuButton
                  onClick={setLink}
                  isActive={editor.isActive("link")}
                  title="Inserir/editar link"
                >
                  <Link2 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => setShowImageModal(true)}
                  title="Inserir imagem"
                >
                  <ImageIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                  title="Linha horizontal"
                >
                  <Minus className="w-4 h-4" />
                </MenuButton>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <EditorContent editor={editor} />
        </div>

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onUpload={handleImageUpload}
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
  }
);

TiptapEditor.displayName = "TiptapEditor";