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
import { s3Storage } from "../_infra/s3.storage";

export class PostService {
  /**
   * Extrair a key do S3 a partir da URL completa
   */
  private extractS3Key(url: string): string | null {
    const bucket = process.env.AWS_S3_BUCKET;
    const pattern = new RegExp(`https://${bucket}\\.s3\\.amazonaws\\.com/(.+)`);
    const match = url.match(pattern);
    return match ? match[1] : null;
  }

  /**
   * Deletar imagem do S3 se existir
   */
  private async deleteS3ImageIfExists(photoUrl?: string | null): Promise<void> {
    if (!photoUrl) return;

    const key = this.extractS3Key(photoUrl);
    if (key) {
      try {
        await s3Storage.delete(key);
      } catch (error) {
        console.error("Erro ao deletar imagem do S3:", error);
        // Não lança erro para não bloquear a operação principal
      }
    }
  }

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
      photoUrl = await s3Storage.uploadPostImage(data.photoFile);
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
 * Buscar posts mais visualizados
 */
  async findMostViewed(limit = 5): Promise<PostWithRelations[]> {
    return postRepository.findMostViewed(limit);
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
    limit = 10,
    offset = 0,
  ): Promise<{ posts: PostWithRelations[]; total: number }> {
    let posts: PostWithRelations[];
    let total: number;

    if (userRole === "ADMIN") {
      posts = await postRepository.findAll(limit, offset);
      total = await postRepository.countAll();
    } else if (userId === undefined || userId === null) {
      posts = [];
      total = 0;
    } else {
      posts = await postRepository.findAll(limit, offset, userId);
      total = await postRepository.countAll(userId);
    }

    return { posts, total };
  }

  /**
   * Pesquisar posts por título
   */
  async searchByTitle(
    searchTerm: string,
    limit = 20,
    offset = 0,
  ): Promise<PostWithRelations[]> {
    return postRepository.searchByTitle(searchTerm, limit, offset, true);
  }

  /**
   * Pesquisar posts por título (admin vê todos, jornalista só os próprios)
   */
  async searchByTitleWithAuth(
    searchTerm: string,
    userId: number,
    userRole: string,
    limit = 20,
    offset = 0,
  ): Promise<PostWithRelations[]> {
    const publishedOnly = userRole !== "ADMIN";
    const results = await postRepository.searchByTitle(
      searchTerm,
      limit,
      offset,
      publishedOnly,
    );

    // Se for jornalista, filtrar apenas os posts dele
    if (userRole === "JOURNALIST") {
      return results.filter((post) => post.authorId === userId);
    }

    return results;
  }

  /**
   * Contar resultados da pesquisa
   */
  async countSearchResults(searchTerm: string): Promise<number> {
    return postRepository.countSearchResults(searchTerm, true);
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

    // Buscar post atual para verificar se há imagem antiga
    const currentPost = await postRepository.findById(id);

    let photoUrl = data.photoUrl;

    // Se está enviando novo arquivo, fazer upload e deletar o antigo
    if (data.photoFile) {
      photoUrl = await s3Storage.uploadPostImage(data.photoFile);

      // Deletar imagem antiga do S3 se existir
      if (currentPost?.photoUrl) {
        await this.deleteS3ImageIfExists(currentPost.photoUrl);
      }
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

    // Se está enviando novo arquivo, fazer upload e deletar o antigo
    if (data.photoFile) {
      photoUrl = await s3Storage.uploadPostImage(data.photoFile);

      // Deletar imagem antiga do S3 se existir
      if (post.photoUrl) {
        await this.deleteS3ImageIfExists(post.photoUrl);
      }
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

    // Deletar imagem do S3 se existir
    if (post?.photoUrl) {
      await this.deleteS3ImageIfExists(post.photoUrl);
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

    // Deletar imagem do S3 se existir
    if (post.photoUrl) {
      await this.deleteS3ImageIfExists(post.photoUrl);
    }

    await postRepository.delete(post.id);
  }
}

export const postService = new PostService();
