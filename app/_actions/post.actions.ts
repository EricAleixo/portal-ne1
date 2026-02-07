// app/_actions/post.actions.ts
'use server'

import { postService } from "@/app/_services/post.service";

export async function incrementPostView(slug: string) {
  try {
    await postService.incrementViews(slug);
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
  }
}