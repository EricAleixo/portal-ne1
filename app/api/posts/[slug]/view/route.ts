import { NextResponse } from "next/server";
import { postService } from "@/app/_services/post.service";

interface Params {
  params: {
    slug: string;
  };
}

export async function POST(_: Request, { params }: Params) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug não informado" },
      { status: 400 }
    );
  }

  try {
    await postService.incrementViews(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao incrementar visualização:", error);

    return NextResponse.json(
      { error: "Erro ao incrementar visualização" },
      { status: 500 }
    );
  }
}
