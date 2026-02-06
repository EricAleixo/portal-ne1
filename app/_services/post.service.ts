import { postRepository } from "@/app/_db/_repositories/post.repository";
import { CreatePostDTO, UpdatePostDTO, Post, PostWithRelations } from "@/app/_types/Post";
import bcrypt from "bcrypt";
import { db } from "../_db";
import { users } from "../_db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export class PostService {
  /**
   * Gerar slug único
   */
  private async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;
    let finalSlug = slug;

    while (await postRepository.slugExists(finalSlug, excludeId)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }

  /**
   * Salvar arquivo de imagem
   */
  private async savePhotoFile(file: any): Promise<string> {
    // Criar diretório de uploads se não existir
    const uploadDir = path.join(process.cwd(), "public", "uploads", "posts");
    await fs.mkdir(uploadDir, { recursive: true });

    // Gerar nome único para o arquivo
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Salvar arquivo
    await fs.writeFile(filepath, file.buffer);

    // Retornar URL pública
    return `/uploads/posts/${filename}`;
  }

  /**
   * Validar senha do usuário
   */
  private async validateUserPassword(userId: number, password: string): Promise<boolean> {
    const [user] = await db
      .select({ password: users.passwordHash })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return bcrypt.compare(password, user.password);
  }

  /**
   * Verificar permissão do usuário
   */
  private async checkPermission(
    userId: number,
    postId: number,
    password: string
  ): Promise<void> {
    // Validar senha
    const isPasswordValid = await this.validateUserPassword(userId, password);
    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

    // Buscar post e usuário
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new Error("Post não encontrado");
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se é admin ou autor
    if (user.role !== "ADMIN" && post.authorId !== userId) {
      throw new Error("Você não tem permissão para realizar esta ação");
    }
  }

  /**
   * Criar post (requer validação de senha)
   */
  async create(data: CreatePostDTO, userId: number, password: string): Promise<Post> {
    // Validar senha
    const isPasswordValid = await this.validateUserPassword(userId, password);

    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

    // Processar imagem (upload ou URL)
    let photoUrl = data.photoUrl || null;
    if (data.photoFile) {
      photoUrl = await this.savePhotoFile(data.photoFile);
    }

    // Gerar slug único
    const slug = await this.generateUniqueSlug(data.title);

    // Criar post
    return await postRepository.create(
      {
        ...data,
        photoUrl: photoUrl || undefined,
      },
      userId,
      slug
    );
  }

  /**
   * Buscar post por ID (público - sem autenticação)
   */
  async findById(id: number): Promise<PostWithRelations | undefined> {
    return postRepository.findByIdWithRelations(id);
  }

  /**
   * Buscar post por slug (público - sem autenticação)
   */
  async findBySlug(slug: string): Promise<Post | undefined> {
    return postRepository.findBySlug(slug);
  }

  /**
   * Listar posts publicados (público - sem autenticação)
   */
  async findAllPublished(limit = 20, offset = 0): Promise<PostWithRelations[]> {
    return postRepository.findAllPublished(limit, offset);
  }

  /**
   * Listar todos os posts (admin vê todos, jornalista vê só os seus)
   */
  async findAll(userId: number, userRole: string, limit = 20, offset = 0): Promise<PostWithRelations[]> {
    const authorId = userRole === "ADMIN" ? undefined : userId;
    return postRepository.findAll(limit, offset, authorId);
  }

  /**
   * Buscar posts por categoria (público - sem autenticação)
   */
  async findByCategory(categoryId: number, limit = 20, offset = 0): Promise<PostWithRelations[]> {
    return postRepository.findByCategory(categoryId, limit, offset);
  }

  /**
   * Buscar posts por tag (público - sem autenticação)
   */
  async findByTag(tag: string, limit = 20, offset = 0): Promise<PostWithRelations[]> {
    return postRepository.findByTag(tag, limit, offset);
  }

  /**
   * Atualizar post (requer validação de senha e permissão)
   */
  async update(
    id: number,
    data: UpdatePostDTO,
    userId: number,
    password: string
  ): Promise<Post> {
    // Verificar permissão e validar senha
    await this.checkPermission(userId, id, password);

    // Processar imagem se houver
    let photoUrl = data.photoUrl;
    if (data.photoFile) {
      photoUrl = await this.savePhotoFile(data.photoFile);
    }

    // Gerar novo slug se o título mudou
    let slug: string | undefined;
    if (data.title) {
      slug = await this.generateUniqueSlug(data.title, id);
    }

    // Atualizar post
    return postRepository.update(id, {
      ...data,
      photoUrl: photoUrl || undefined,
    });
  }

  /**
   * Deletar post (requer validação de senha e permissão)
   */
  async delete(id: number, userId: number, password: string): Promise<void> {
    // Verificar permissão e validar senha
    await this.checkPermission(userId, id, password);

    // Buscar post para deletar imagem se houver
    const post = await postRepository.findById(id);
    if (post?.photoUrl && post.photoUrl.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), "public", post.photoUrl);
      try {
        await fs.unlink(filepath);
      } catch (error) {
        // Ignorar erro se arquivo não existir
        console.error("Erro ao deletar arquivo:", error);
      }
    }

    // Deletar post
    await postRepository.delete(id);
  }
}

export const postService = new PostService();