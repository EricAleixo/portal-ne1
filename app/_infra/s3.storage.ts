// app/_infra/storage/s3.storage.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

export class S3Storage {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadProfileImage(userId: number, file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `profile-images/${userId}/${randomUUID()}-${file.name}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  }

  // 👉 NOVO: upload de imagem de post
  async uploadPostImage(file: File) {
    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const key = `posts/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );
  }
}

export const s3Storage = new S3Storage();
