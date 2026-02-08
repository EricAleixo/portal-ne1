import { NextRequest, NextResponse } from "next/server";
import { s3Storage } from "@/app/_infra/s3.storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 5MB" },
        { status: 400 }
      );
    }

    // Fazer upload para o S3
    const url = await s3Storage.uploadPostImage(file);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da imagem" },
      { status: 500 }
    );
  }
}