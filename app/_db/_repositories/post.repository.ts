import { db } from "..";
import { posts, users, categories } from "../schema";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import {
  CreatePostDTO,
  UpdatePostDTO,
  Post,
  PostWithRelations,
} from "@/app/_types/Post";

export class PostRepository {
  async create(
    data: CreatePostDTO,
    authorId: number,
    slug: string,
  ): Promise<Post> {
    const values: any = {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      tags: data.tags,
      authorId,
      categoryId: data.categoryId,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
    };

    if (data.photoUrl) {
      values.photoUrl = data.photoUrl;
    }

    if (data.published) {
      values.published = true;
      values.publishedAt = new Date();
    }

    try {
      const [post] = await db.insert(posts).values(values).returning();
      return post;
    } catch (err) {
      console.error("❌ ERRO AO INSERIR POST:", err);
      throw err;
    }

  }

  async findById(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    return post;
  }

  async findByIdWithRelations(
    id: number,
  ): Promise<PostWithRelations | undefined> {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        views: posts.views,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
        },
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, id))
      .limit(1);

    return post as PostWithRelations | undefined;
  }

  async findBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    return post;
  }

  async findAllPublished(limit = 20, offset = 0): Promise<PostWithRelations[]> {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        views: posts.views,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
        },
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    return result as PostWithRelations[];
  }

  async findAll(
    limit = 20,
    offset = 0,
    authorId?: number,
  ): Promise<PostWithRelations[]> {
    const conditions = authorId ? eq(posts.authorId, authorId) : undefined;

    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        views: posts.views,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
        },
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(conditions)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return result as PostWithRelations[];
  }

  async findByCategory(
    categoryId: number,
    limit = 20,
    offset = 0,
  ): Promise<PostWithRelations[]> {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        views: posts.views,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
        },
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(eq(posts.categoryId, categoryId), eq(posts.published, true)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    return result as PostWithRelations[];
  }

  async findByTag(
    tag: string,
    limit = 20,
    offset = 0,
  ): Promise<PostWithRelations[]> {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        content: posts.content,
        photoUrl: posts.photoUrl,
        tags: posts.tags,
        views: posts.views,
        authorId: posts.authorId,
        categoryId: posts.categoryId,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          role: users.role,
        },
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(eq(posts.published, true)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    return result.filter((post) =>
      post.tags.includes(tag.toLowerCase()),
    ) as PostWithRelations[];
  }

  async update(id: number, data: Partial<UpdatePostDTO>): Promise<Post> {
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.published === true) {
      updateData.publishedAt = new Date();
    }

    const [post] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return post;
  }

  async delete(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const conditions = excludeId
      ? and(eq(posts.slug, slug), eq(posts.id, excludeId))
      : eq(posts.slug, slug);

    const [result] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(conditions)
      .limit(1);

    return !!result;
  }
}

export const postRepository = new PostRepository();
