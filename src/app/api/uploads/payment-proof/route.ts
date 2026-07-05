import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCurrentUser, isAdminRole } from '@/lib/server-auth';
import { isLocalUploadStorageEnabled, uploadPrivateObject } from '@/lib/storage';

const allowedTypes = new Map([
  ['application/pdf', '.pdf'],
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
]);

const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'file is required' },
        { status: 400 }
      );
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use PDF, JPG, or PNG.' },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File must be between 1 byte and 5MB' },
        { status: 400 }
      );
    }

    const upload = await uploadPrivateObject({
      buffer: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
      extension,
      userId: user.id,
      category: 'payment-proofs',
    });

    return NextResponse.json({
      success: true,
      proofKey: upload.key,
      proofUrl: upload.url,
    });
  } catch (error) {
    console.error('Payment proof upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!isLocalUploadStorageEnabled()) {
      return NextResponse.json(
        { error: 'Local upload serving is disabled' },
        { status: 404 }
      );
    }

    const key = new URL(request.url).searchParams.get('key') || '';
    const expectedPrefix = `payment-proofs/${user.id}/`;
    if (!key.startsWith(expectedPrefix) && !isAdminRole(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const safeKey = key.split('/').map((part) => path.basename(part)).join(path.sep);
    const localPath = path.join(process.cwd(), '.local-uploads', safeKey);
    const file = await readFile(localPath);
    const extension = path.extname(localPath).toLowerCase();
    const contentType = extension === '.pdf'
      ? 'application/pdf'
      : extension === '.png'
        ? 'image/png'
        : 'image/jpeg';

    return new NextResponse(file, {
      headers: {
        'content-type': contentType,
        'cache-control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Payment proof download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
