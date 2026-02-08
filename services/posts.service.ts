import { api } from './api';
import { Post } from '@/app/_types/Post';

export const postService = {
  // Buscar todos os posts (com paginação)
  getAll: async (limit = 20, offset = 0): Promise<Post[]> => {
    const { data } = await api.get(`/posts?limit=${limit}&offset=${offset}`);
    return data.data;
  },

  // Buscar post por SLUG (para visualização pública)
  findBySlug: async (slug: string): Promise<Post> => {
    const { data } = await api.get(`/posts/slug/${slug}`);
    return data.data;
  },

  // Criar novo post
  create: async (postData: FormData): Promise<Post> => {
    const { data } = await api.post('/posts', postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },

  // Deletar por ID
  delete: async (id: number, password: string) => {
    const { data } = await api.delete(`/posts/${id}`, {
      data: { password }
    });
    return data;
  },

  // Atualizar por SLUG
  update: async (slug: string, postData: FormData): Promise<Post> => {
    const { data } = await api.put(`/posts/${slug}`, postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  }
};