"use client";

import React from "react";
import { postService } from "@/services/posts.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post";
import { PostForm, PostFormData } from "../molecules/PostForm";

interface EditPostProps {
  post: Post;
  onCancel?: () => void;
  categories?: Array<{ id: number; name: string; color: string }>;
}

export const EditPost: React.FC<EditPostProps> = ({
  post,
  onCancel,
  categories = [],
}) => {
  const router = useRouter();

  const initialData: PostFormData = {
    title: post.title,
    description: post.description,
    tags: post.tags,
    photo: null,
    photoUrl: post.photoUrl,
    categoryId: post.categoryId,
    content: post.content,
    published: post.published,
  };

  const handleSubmit = async (submitData: FormData, password: string) => {
    submitData.append("password", password);

    try {
      await postService.update(post.slug, submitData);
      toast.success(`${post.title} atualizado com sucesso!`);
      setTimeout(() => router.push("/journalist"), 1500);
    } catch (error) {
      toast.error("Senha inválida!");
    }
  };

  return (
    <PostForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      categories={categories}
    />
  );
};