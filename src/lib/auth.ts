import { SignJWT, jwtVerify } from 'jose';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return new TextEncoder().encode(secret);
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signJWT(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}
