import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/app/_services/user.service';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const user = await userService.findById(id);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);

    if (error instanceof Error && error.message === 'USER NOT FOUND') {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, password, role } = body;

    // Validação
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    if (role && !['ADMIN', 'JOURNALIST'].includes(role)) {
      return NextResponse.json(
        { error: 'Função inválida' },
        { status: 400 }
      );
    }

    const updateData: { name?: string; password?: string; role?: 'ADMIN' | 'JOURNALIST' } = {};
    
    if (name) updateData.name = name;
    if (password) updateData.password = password;
    if (role) updateData.role = role;

    const user = await userService.update(id, updateData);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);

    if (error instanceof Error) {
      if (error.message === 'USER NOT FOUND') {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      if (error.message === 'NAME ALREADY IN USE') {
        return NextResponse.json(
          { error: 'Nome já está em uso' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await userService.delete(id);

    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);

    if (error instanceof Error && error.message === 'USER NOT FOUND') {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}