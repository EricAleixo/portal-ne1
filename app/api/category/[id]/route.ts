import { categoryService } from "@/app/_services/categorie.service";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params; // agora realmente é uma Promise
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const category = await categoryService.getById(id);

    if (!category) {
      return NextResponse.json({ message: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ message: "Erro ao buscar categoria" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    const body = await request.json();
    const { name, color } = body;

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    if (!name && !color) {
      return NextResponse.json({ message: "Nada para atualizar" }, { status: 400 });
    }

    const updated = await categoryService.update(id, { name, color });

    if (!updated) {
      return NextResponse.json({ message: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    await categoryService.delete(id);

    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ message: "Erro ao remover categoria" }, { status: 500 });
  }
}
