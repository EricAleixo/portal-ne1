import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/app/_services/user.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password } = body;

    // Validação básica
    if (!name || !password) {
      return NextResponse.json(
        { error: 'Nome e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    const user = await userService.create(name, password);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    if (error instanceof Error) {
      if (error.message === 'USER ALREADY EXISTS') {
        return NextResponse.json(
          { error: 'Usuário já existe' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await userService.findAll();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar usuários' },
      { status: 500 }
    );
  }
}