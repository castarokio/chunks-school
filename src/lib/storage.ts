import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const signedUrlTtlSeconds = 10 * 60;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for private object storage`);
  return value;
}

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: requiredEnv('S3_ENDPOINT'),
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    credentials: {
      accessKeyId: requiredEnv('S3_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('S3_SECRET_ACCESS_KEY'),
    },
  });
}

export function isLocalUploadStorageEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.LOCAL_UPLOAD_STORAGE === 'true';
}

export async function uploadPrivateObject(input: {
  buffer: Buffer;
  contentType: string;
  extension: string;
  userId: string;
  category: string;
}) {
  const key = `${input.category}/${input.userId}/${randomUUID()}${input.extension}`;

  if (isLocalUploadStorageEnabled()) {
    const uploadDir = path.join(process.cwd(), '.local-uploads', input.category, input.userId);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, path.basename(key)), input.buffer);

    return { key, url: `/api/uploads/payment-proof?key=${encodeURIComponent(key)}` };
  }

  const bucket = requiredEnv('S3_BUCKET');
  const serverSideEncryption = process.env.S3_SERVER_SIDE_ENCRYPTION === 'aws:kms'
    ? 'aws:kms'
    : 'AES256';

  await getS3Client().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: input.buffer,
    ContentType: input.contentType,
    ServerSideEncryption: serverSideEncryption,
  }));

  return {
    key,
    url: await createSignedReadUrl(key),
  };
}

export async function createSignedReadUrl(key: string): Promise<string> {
  if (isLocalUploadStorageEnabled()) {
    return `/api/uploads/payment-proof?key=${encodeURIComponent(key)}`;
  }

  const bucket = requiredEnv('S3_BUCKET');
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: signedUrlTtlSeconds },
  );
}
