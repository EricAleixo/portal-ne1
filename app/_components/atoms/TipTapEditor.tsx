"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
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
} from "lucide-react";
import { useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

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
      isActive
        ? "bg-[#283583] text-white hover:bg-[#1e2860]"
        : "text-gray-700"
    }`}
  >
    {children}
  </button>
);

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content, onChange, error }, ref) => {
    const isInitialMount = useRef(true);
    const onChangeRef = useRef(onChange);

    // Atualizar ref do onChange sem causar re-render
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    const editor = useEditor({
      immediatelyRender: false, // Fix SSR hydration error
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
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded-lg",
          },
        }),
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
      },
      onUpdate: ({ editor }) => {
        // Usar a ref do onChange para evitar stale closures e re-renders
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

    // Atualizar editor apenas quando o conteúdo inicial mudar (não em cada digitação)
    useEffect(() => {
      if (editor && isInitialMount.current) {
        const currentContent = editor.getHTML();
        // Normalizar comparação (remover espaços vazios)
        const normalizedCurrent = currentContent.replace(/<p><\/p>/g, '').trim();
        const normalizedNew = content.replace(/<p><\/p>/g, '').trim();
        
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

      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
      if (!editor) return;

      const url = window.prompt("URL da imagem:");

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }, [editor]);

    if (!editor) {
      return null;
    }

    return (
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
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Lista com marcadores"
              >
                <List className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Lista numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 px-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
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
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                isActive={editor.isActive({ textAlign: "right" })}
                title="Alinhar à direita"
              >
                <AlignRight className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Quote & Code */}
            <div className="flex gap-1 px-2 border-r border-gray-300">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Citação"
              >
                <Quote className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
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
              <MenuButton onClick={addImage} title="Inserir imagem">
                <ImageIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
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
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";