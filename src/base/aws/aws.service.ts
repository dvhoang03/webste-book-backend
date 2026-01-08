import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { config } from '@/config';
import * as sharp from 'sharp';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client;
  private readonly bucket = config.MINIO.BUCKET;

  constructor() {
    this.minioClient = new Client({
      endPoint: config.MINIO.HOST,
      port: config.MINIO.PORT,
      useSSL: config.MINIO.USE_SSL,
      accessKey: config.MINIO.ACCESS_KEY,
      secretKey: config.MINIO.SECRET_KEY,
    });
  }

  async onModuleInit() {
    await this.ensureBucket();
  }

  private async ensureBucket() {
    const exists = await this.minioClient
      .bucketExists(this.bucket)
      .catch(() => false);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucket, 'us-east-1');
    }

    // ✅ Set policy public
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };

    await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(policy));
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(
      this.bucket,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    const path = `${filename}`;
    return { filename, path };
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const results: { filename: string; path: string }[] = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.originalname}`;
      await this.minioClient.putObject(
        this.bucket,
        filename,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );
      results.push({ filename, path: `${filename}` });
    }

    return results;
  }

  async uploadAvatar(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname}`;
    const thumbFilename = `${Date.now()}-thumb-${file.originalname}`;

    // Resize thumbnail 200x200 (tuỳ chỉnh)
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(200, 200)
      .toBuffer();

    // Upload ảnh gốc
    await this.minioClient.putObject(
      this.bucket,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    // Upload ảnh thumbnail
    await this.minioClient.putObject(
      this.bucket,
      thumbFilename,
      thumbnailBuffer,
      thumbnailBuffer.length,
      {
        'Content-Type': file.mimetype,
      },
    );
    return {
      original: {
        path: `${filename}`,
        filename,
      },
      thumbnail: {
        path: `${thumbFilename}`,
        filename: thumbFilename,
      },
    };
  }

  async deleteFile(objectName: string) {
    try {
      await this.minioClient.removeObject(this.bucket, objectName);
      return { success: true, message: `Deleted ${objectName}` };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete ${objectName}`,
        error,
      };
    }
  }

  async deleteFiles(objectNames: string[]) {
    try {
      await this.minioClient.removeObjects(this.bucket, objectNames);
      return { success: true, message: `Deleted ${objectNames.length} files` };
    } catch (error) {
      return { success: false, message: `Failed to delete files`, error };
    }
  }
}
