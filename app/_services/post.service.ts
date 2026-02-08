import { postRepository } from "@/app/_db/_repositories/post.repository";
import {
  CreatePostDTO,
  UpdatePostDTO,
  Post,
  PostWithRelations,
} from "@/app/_types/Post";
import bcrypt from "bcrypt";
import { db } from "@/app/_db/";
import { users } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "@/lib/aws/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export class PostService {
  /**
   * Gerar slug único
   */
  private async generateUniqueSlug(
    title: string,
    excludeId?: number,
  ): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await postRepository.slugExists(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Salvar arquivo de imagem
   */
  private async savePhotoFile(file: File): Promise<string> {
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `posts/${filename}`,
        Body: buffer,
        ContentType: file.type
      }),
    );

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/posts/${filename}`;
  }

  /**
   * Validar senha do usuário
   */
  private async validateUserPassword(
    userId: number,
    password: string,
  ): Promise<boolean> {
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
    password: string,
  ): Promise<void> {
    const isPasswordValid = await this.validateUserPassword(userId, password);

    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

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

    if (user.role !== "ADMIN" && post.authorId !== userId) {
      throw new Error("Você não tem permissão para realizar esta ação");
    }
  }

  /**
   * Criar post
   */
  async create(
    data: CreatePostDTO,
    userId: number,
    password: string,
  ): Promise<Post> {
    const isPasswordValid = await this.validateUserPassword(userId, password);

    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

    let photoUrl = data.photoUrl ?? undefined;

    if (data.photoFile) {
      photoUrl = await this.savePhotoFile(data.photoFile);
    }

    const slug = await this.generateUniqueSlug(data.title);

    return postRepository.create(
      {
        ...data,
        photoUrl,
      },
      userId,
      slug,
    );
  }

  /**
   * Buscar post por ID
   */
  async findById(id: number): Promise<PostWithRelations | undefined> {
    return postRepository.findByIdWithRelations(id);
  }

  /**
   * Buscar post por slug
   */
  async findBySlug(slug: string): Promise<Post | undefined> {
    return postRepository.findBySlug(slug);
  }

  /**
   * Incrementar visualizações
   */
  async incrementViews(slug: string): Promise<void> {
    await postRepository.incrementViews(slug);
  }

  /**
   * Listar posts publicados
   */
  async findAllPublished(limit = 20, offset = 0): Promise<PostWithRelations[]> {
    return postRepository.findAllPublished(limit, offset);
  }

  /**
   * Listar posts (admin vê todos, jornalista só os próprios)
   */
  async findAll(
    userId: number,
    userRole: string,
    limit = 20,
    offset = 0,
  ): Promise<PostWithRelations[]> {
    const authorId = userRole === "ADMIN" ? undefined : userId;
    return postRepository.findAll(limit, offset, authorId);
  }

  /**
   * Atualizar post
   */
  async update(
    id: number,
    data: UpdatePostDTO,
    userId: number,
    password: string,
  ): Promise<Post> {
    await this.checkPermission(userId, id, password);

    let photoUrl = data.photoUrl;

    if (data.photoFile) {
      photoUrl = await this.savePhotoFile(data.photoFile);
    }

    let slug: string | undefined;
    if (data.title) {
      slug = await this.generateUniqueSlug(data.title, id);
    }

    return postRepository.update(id, {
      ...data,
      slug,
      photoUrl,
    });
  }

  /**
   * Atualizar post pelo slug
   */
  async updateBySlug(
    slug: string,
    data: UpdatePostDTO,
    userId: number,
    password: string,
  ): Promise<Post> {
    const post = await postRepository.findBySlug(slug);

    if (!post) {
      throw new Error("Post não encontrado");
    }

    // valida permissão + senha usando o ID real
    await this.checkPermission(userId, post.id, password);

    let photoUrl = data.photoUrl;

    if (data.photoFile) {
      photoUrl = await this.savePhotoFile(data.photoFile);
    }

    let newSlug: string | undefined;
    if (data.title && data.title !== post.title) {
      newSlug = await this.generateUniqueSlug(data.title, post.id);
    }

    return postRepository.update(post.id, {
      ...data,
      slug: newSlug,
      photoUrl,
    });
  }

  /**
   * Deletar post
   */
  async delete(id: number, userId: number, password: string): Promise<void> {
    await this.checkPermission(userId, id, password);

    const post = await postRepository.findById(id);

    if (post?.photoUrl?.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), "public", post.photoUrl);

      try {
        await fs.unlink(filepath);
      } catch {
        // ignora erro se arquivo não existir
      }
    }

    await postRepository.delete(id);
  }

  /**
   * Deletar post pelo slug
   */
  async deleteBySlug(
    slug: string,
    userId: number,
    password: string,
  ): Promise<void> {
    const post = await postRepository.findBySlug(slug);

    if (!post) {
      throw new Error("Post não encontrado");
    }

    // valida permissão + senha
    await this.checkPermission(userId, post.id, password);

    if (post.photoUrl?.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), "public", post.photoUrl);

      try {
        await fs.unlink(filepath);
      } catch {
        // ignora erro se arquivo não existir
      }
    }

    await postRepository.delete(post.id);
  }
}

export const postService = new PostService();
