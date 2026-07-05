# Deployment

## Required Production Services

- PostgreSQL database
- S3/R2-compatible private bucket for payment proofs
- Vercel project linked to this GitHub repository

## Required Runtime Environment Variables

Use `.env.example` as the source of truth:

- `DATABASE_URL`
- `JWT_SECRET`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`
- `S3_SERVER_SIDE_ENCRYPTION`
- `LOCAL_UPLOAD_STORAGE=false`

## Required GitHub Secrets For Deployment Workflow

- `DATABASE_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The Vercel project itself also needs the runtime environment variables from `.env.example`.

## First Production Deploy

1. Create the production PostgreSQL database.
2. Create the private S3/R2 bucket and access keys.
3. Add runtime variables to Vercel.
4. Add workflow secrets to GitHub.
5. Run the `Deploy to Vercel` workflow from GitHub Actions.

The workflow runs `prisma migrate deploy` before deploying the Vercel artifact.
