import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('public registration only allows non-privileged roles', () => {
  const source = read('src/app/api/auth/register/route.ts');

  assert.match(source, /const validRoles = \['student', 'parent'\]/);
  assert.doesNotMatch(source, /const validRoles = .*admin/);
  assert.doesNotMatch(source, /const validRoles = .*owner/);
  assert.doesNotMatch(source, /const validRoles = .*teacher/);
});

test('privileged user creation remains admin-only and validates role values', () => {
  const source = read('src/app/api/users/route.ts');

  assert.match(source, /getCurrentUser\(request\)/);
  assert.match(source, /isAdminRole\(requester\.role\)/);
  assert.match(source, /canCreateRole\(requester\.role, role\)/);
  assert.match(source, /const validRoles = \['student', 'teacher', 'parent', 'admin', 'admin_manager', 'owner'\]/);
});

test('scoped dashboard and user data routes derive identity from middleware headers', () => {
  const stats = read('src/app/api/dashboard/stats/route.ts');
  const store = read('src/lib/store.ts');
  const notifications = read('src/app/api/notifications/route.ts');
  const gamification = read('src/app/api/gamification/route.ts');

  assert.match(stats, /getCurrentUser\(request\)/);
  assert.doesNotMatch(stats, /searchParams\.get\('role'\)/);
  assert.doesNotMatch(stats, /searchParams\.get\('userId'\)/);

  assert.match(notifications, /getCurrentUser\(request\)/);
  assert.doesNotMatch(notifications, /searchParams\.get\('userId'\)/);

  assert.match(gamification, /getCurrentUser\(request\)/);
  assert.doesNotMatch(gamification, /searchParams\.get\('userId'\)/);

  assert.match(store, /fetch\('\/api\/enrollments'\)/);
  assert.match(store, /fetch\('\/api\/notifications'\)/);
  assert.match(store, /fetch\('\/api\/gamification'\)/);
  assert.match(store, /fetch\('\/api\/dashboard\/stats'\)/);
  assert.doesNotMatch(store, /dashboard\/stats\?role=/);
  assert.doesNotMatch(store, /notifications\?userId=/);
  assert.doesNotMatch(store, /gamification\?userId=/);
});

test('auth and runtime data paths do not fall back to mock sessions or in-memory stores', () => {
  const authPage = read('src/components/auth/AuthPage.tsx');
  const notifications = read('src/app/api/notifications/route.ts');
  const gamification = read('src/app/api/gamification/route.ts');

  assert.doesNotMatch(authPage, /mockUsers/);
  assert.doesNotMatch(authPage, /setUser\(\{\s*id: 'new-'/);

  assert.match(notifications, /db\.notification\.findMany/);
  assert.match(notifications, /db\.notification\.create/);
  assert.doesNotMatch(notifications, /createdNotifications/);
  assert.doesNotMatch(notifications, /mockNotifications/);

  assert.match(gamification, /db\.gamification\.upsert/);
  assert.match(gamification, /db\.skill\.findMany/);
  assert.match(gamification, /db\.leaderboard\.findMany/);
  assert.doesNotMatch(gamification, /mockGamification/);
  assert.doesNotMatch(gamification, /mockSkills/);
});

test('production builds cannot bypass TypeScript or JWT secret requirements', () => {
  const nextConfig = read('next.config.ts');
  const auth = read('src/lib/auth.ts');

  assert.doesNotMatch(nextConfig, /ignoreBuildErrors\s*:\s*true/);
  assert.match(auth, /JWT_SECRET is required/);
  assert.doesNotMatch(auth, /champs-school-dev-secret/);
});

test('production data model does not use sqlite or floating-point money', () => {
  const schema = read('prisma/schema.prisma');
  const seed = read('prisma/seed.ts');

  assert.match(schema, /provider = "postgresql"/);
  assert.doesNotMatch(schema, /provider = "sqlite"/);
  assert.match(schema, /priceMinor\s+Int/);
  assert.match(schema, /amountMinor\s+Int/);
  assert.doesNotMatch(schema, /\bprice\s+Float/);
  assert.doesNotMatch(schema, /\bamount\s+Float/);
  assert.doesNotMatch(seed, /Math\.random/);
});

test('payment proofs use private storage keys instead of public upload paths', () => {
  const uploadRoute = read('src/app/api/uploads/payment-proof/route.ts');
  const paymentsRoute = read('src/app/api/payments/route.ts');

  assert.match(uploadRoute, /uploadPrivateObject/);
  assert.match(paymentsRoute, /proofKey/);
  assert.match(paymentsRoute, /createSignedReadUrl/);
  assert.doesNotMatch(paymentsRoute, /\/uploads\/payment-proofs/);
  assert.doesNotMatch(uploadRoute, /public', 'uploads/);
});
