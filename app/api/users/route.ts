import { userService } from '@/app/_services/user.service';
import type { CreateUserBody } from '@/app/_types/Auth';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserBody;
    const { name } = body.user;

    if (!name) {
      return Response.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const user = await userService.findByName(name);

    if (!user) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userCompact = {
      name: user.name,
    };

    return Response.json(userCompact, { status: 200 });

  } catch (err) {
    console.error(err);

    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
