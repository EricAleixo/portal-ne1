import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255, "Título muito longo"),
  slug: z.string().min(1).max(255),
  description: z.string().min(1, "Descrição é obrigatória").max(500, "Descrição muito longa"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  photoFile: z.any().optional(),
  photoUrl: z.string().url().optional(),
  tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag").max(10, "Máximo de 10 tags"),
  categoryId: z.number().int().positive("Categoria é obrigatória"),
  published: z.boolean().default(false),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255),
  description: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  photoFile: z.any().optional(),
  photoUrl: z.string().url().optional(),
  tags: z.array(z.string()).min(1).max(10).optional(),
  categoryId: z.number().int().positive().optional(),
  published: z.boolean().default(false),
});

export const passwordConfirmationSchema = z.object({
  password: z.string().min(1, "Senha é obrigatória"),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
export type PasswordConfirmation = z.infer<typeof passwordConfirmationSchema>;

export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  photoUrl: string | null;
  tags: string[];
  views: number;
  authorId: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface PostWithRelations extends Post {
  author: {
    id: number;
    name: string;
    role: "ADMIN" | "JOURNALIST";
  };
  category: {
    id: number;
    name: string;
    color: string;
  };
}