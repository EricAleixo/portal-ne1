// app/api/posts/public/[id]/route.ts
import { postService } from "@/app/_services/post.service";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> } // FORÇADO como Promise
) {
  const resolvedParams = await params; // agora realmente é Promise
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "ID inválido" },
      { status: 400 }
    );
  }

  const post = await postService.findById(id);
  if (!post) {
    return NextResponse.json(
      { success: false, message: "Post não encontrado" },
      { status: 404 }
    );
  }

  if (!post.published) {
    return NextResponse.json(
      { success: false, message: "Post não publicado" },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, data: post });
}
