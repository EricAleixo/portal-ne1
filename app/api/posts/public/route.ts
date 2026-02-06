// app/api/posts/public/route.ts
import { postService } from "@/app/_services/post.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;

    const posts = await postService.findAllPublished(limit, offset);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { limit, offset, total: posts.length },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}
