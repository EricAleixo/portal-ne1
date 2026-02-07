// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "../_utils/session";
import { postService } from "@/app/_services/post.service";
import { createPostSchema, passwordConfirmationSchema } from "@/app/_types/Post";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;

    const posts = await postService.findAll(
      session.user.id,
      session.user.role,
      limit,
      offset
    );

    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json(
      { success: false, message: "Não autenticado" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const formData = await req.formData();

    const rawCategoryId = formData.get("categoryId");
    const publishedRaw = formData.get("published");
    
    const photoFileRaw = formData.get("photoFile")
    
    let data;

    if(photoFileRaw){
      data = createPostSchema.parse({
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        tags: JSON.parse(String(formData.get("tags") || "[]")),
        categoryId: rawCategoryId ? Number(rawCategoryId) : undefined,
        published: publishedRaw === "true",
        photoFile: formData.get("photoFile"),
        //photoUrl: formData.get("photoUrl")
      });
    }
    else{
      data = createPostSchema.parse({
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        tags: JSON.parse(String(formData.get("tags") || "[]")),
        categoryId: rawCategoryId ? Number(rawCategoryId) : undefined,
        published: publishedRaw === "true",
        photoFile: formData.get("photoFile"),
        //photoUrl: formData.get("photoUrl")
      });
    }


    const { password } = passwordConfirmationSchema.parse({
      password: formData.get("password"),
    });


    const post = await postService.create(
      data,
      session.user.id,
      password
    );

    return NextResponse.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
