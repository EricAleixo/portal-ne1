"use client";

import React from "react";
import { postService } from "@/services/posts.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PostForm } from "../molecules/PostForm";

interface CreatePostProps {
  onCancel?: () => void;
  categories?: Array<{ id: number; name: string; color: string }>;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  onCancel,
  categories = [],
}) => {
  const router = useRouter();

  const handleSubmit = async (submitData: FormData, password: string) => {
    submitData.append("password", password);

    try {
      const post = await postService.create(submitData);
      toast.success(`${post.title} postado com sucesso!`)
      setTimeout(() => router.push("/journalist/posts"), 1500);
    } catch (error) {
      toast.error("Senha inválida!");
      throw error;
    }
  };

  return (
    <PostForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      categories={categories}
    />
  );
};