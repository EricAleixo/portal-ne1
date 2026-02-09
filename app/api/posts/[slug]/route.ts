import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "../../_utils/session";
import { postService } from "@/app/_services/post.service";
import { updatePostSchema, passwordConfirmationSchema } from "@/app/_types/Post";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchTerm = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (searchTerm.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "O termo de busca deve ter no mínimo 2 caracteres",
          data: [],
          total: 0,
        },
        { status: 400 }
      );
    }

    const [posts, total] = await Promise.all([
      postService.searchByTitle(searchTerm, limit, offset),
      postService.countSearchResults(searchTerm),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      total,
      query: searchTerm,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Erro ao pesquisar posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao pesquisar posts",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // FORÇADO como Promise
) {
  try {
    const session = await getSessionOrThrow();
    const resolvedParams = await params; // agora realmente é Promise
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug inválido" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const data = updatePostSchema.parse({
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      content: formData.get("content") || undefined,
      tags: formData.get("tags")
        ? JSON.parse(String(formData.get("tags")))
        : undefined,
      categoryId: formData.get("categoryId")
        ? Number(formData.get("categoryId"))
        : undefined,
      published: formData.get("published")
        ? formData.get("published") === "true"
        : undefined,
      photoFile: formData.get("photoFile"),
    });

    const { password } = passwordConfirmationSchema.parse({
      password: formData.get("password"),
    });

    const post = await postService.updateBySlug(
      slug,
      data,
      session.user.id,
      password
    );

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // FORÇADO como Promise
) {
  try {
    const session = await getSessionOrThrow();
    const resolvedParams = await params; // Promise resolvida
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { password } = passwordConfirmationSchema.parse(body);

    await postService.deleteBySlug(
      slug,
      session.user.id,
      password
    );

    return NextResponse.json({
      success: true,
      message: "Post deletado com sucesso",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
