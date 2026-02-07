import { categoryService } from "@/app/_services/categorie.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await categoryService.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json(
        { message: "name e color são obrigatórios" },
        { status: 400 }
      );
    }

    const category = await categoryService.create({ name, color });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}
