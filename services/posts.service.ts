import { api } from './api';
import { Post } from '@/app/_types/Post';

export const postService = {
  getAll: async (limit = 20, offset = 0): Promise<Post[]> => {
    const { data } = await api.get(`/posts?limit=${limit}&offset=${offset}`);
    return data.data;
  },
  
  create: async (postData: FormData): Promise<Post> => {
    const { data } = await api.post('/posts', postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },
  
  delete: async (id: number, password: string) => {
    const { data } = await api.delete(`/posts/${id}`, {
      data: { password }
    });
    return data;
  },
  
  update: async (id: number, postData: FormData) => {
    const { data } = await api.put(`/posts/${id}`, postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  }
};