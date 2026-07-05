import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { clearRateLimitBuckets } from '../src/lib/rate-limit';

const prisma: any = {
  user: {},
  enrollment: {},
  payment: {},
  course: {},
  attendance: {},
  notification: {},
  contactMessage: {},
  setting: {},
  $transaction: async (arg: any) => {
    if (typeof arg === 'function') return arg(prisma);
    return Promise.all(arg);
  },
};

(globalThis as any).prisma = prisma;
process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long';

const jsonRequest = (
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
) => new NextRequest(url, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-forwarded-for': '127.0.0.1',
    ...headers,
  },
  body: JSON.stringify(body),
});

const authedRequest = (
  url: string,
  body: unknown,
  user: { id: string; role: string; email?: string },
) => jsonRequest(url, body, {
  'x-user-id': user.id,
  'x-user-role': user.role,
  'x-user-email': user.email || `${user.id}@champs.test`,
});

const authedGetRequest = (
  url: string,
  user: { id: string; role: string; email?: string },
) => new NextRequest(url, {
  method: 'GET',
  headers: {
    'x-user-id': user.id,
    'x-user-role': user.role,
    'x-user-email': user.email || `${user.id}@champs.test`,
  },
});

beforeEach(() => {
  clearRateLimitBuckets();

  prisma.user.findUnique = async ({ where }: any) => ({
    id: where.id,
    email: `${where.id}@champs.test`,
    role: 'student',
    isActive: true,
  });
  prisma.user.findFirst = async () => null;
  prisma.user.findMany = async () => [];
  prisma.user.create = async ({ data }: any) => ({ id: 'created-user', isActive: true, ...data });
  prisma.user.update = async ({ where, data }: any) => ({
    id: where.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    language: data.language || 'ar',
    role: 'student',
    twoFactorEnabled: Boolean(data.twoFactorEnabled),
  });

  prisma.enrollment.findUnique = async () => null;
  prisma.enrollment.create = async ({ data }: any) => ({ id: 'enrollment-1', enrolledAt: new Date('2026-01-01T00:00:00Z'), progress: 0, ...data, course: {
    id: data.courseId,
    title: 'Course',
    titleAr: null,
    titleFr: null,
    description: 'Course',
    category: 'language',
    level: 'beginner',
    priceMinor: 100,
    currency: 'DZD',
    capacity: 10,
    schedule: '{}',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-06-01T00:00:00Z'),
    status: 'active',
    teacherId: 'teacher-1',
    teacher: { name: 'Teacher' },
    _count: { enrollments: 1 },
  } });
  prisma.enrollment.count = async () => 0;
  prisma.enrollment.update = async ({ where, data }: any) => ({ id: where.id, enrollmentId: where.id, ...data });

  prisma.payment.create = async ({ data }: any) => ({ id: 'payment-1', createdAt: new Date('2026-01-01T00:00:00Z'), ...data });
  prisma.payment.findFirst = async () => null;
  prisma.payment.update = async ({ where, data }: any) => ({ id: where.id, enrollmentId: 'enrollment-1', ...data });
  prisma.payment.count = async () => 0;
  prisma.payment.aggregate = async () => ({ _sum: { amountMinor: 0 } });

  prisma.course.findUnique = async ({ where }: any) => ({
    id: where.id,
    teacherId: 'teacher-1',
    status: 'active',
    capacity: 10,
    priceMinor: 100,
    currency: 'DZD',
    endDate: new Date('2027-06-01T00:00:00Z'),
  });
  prisma.course.findMany = async () => [];
  prisma.course.count = async () => 0;
  prisma.course.create = async ({ data }: any) => ({ id: 'course-created', createdAt: new Date('2026-01-01T00:00:00Z'), updatedAt: new Date('2026-01-01T00:00:00Z'), ...data, teacher: { id: data.teacherId, name: 'Teacher' }, _count: { enrollments: 0 } });

  prisma.attendance.deleteMany = async () => ({ count: 0 });
  prisma.attendance.createMany = async ({ data }: any) => ({ count: data.length });
  prisma.attendance.count = async () => 0;

  prisma.notification.findMany = async () => [];
  prisma.notification.count = async () => 0;
  prisma.notification.create = async ({ data }: any) => ({
    id: 'notification-1',
    isRead: false,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...data,
  });
  prisma.notification.createMany = async ({ data }: any) => ({ count: data.length });

  prisma.contactMessage.create = async ({ data }: any) => ({
    id: 'contact-1',
    status: 'new',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...data,
  });
  prisma.contactMessage.findMany = async () => [];

  prisma.setting.findUnique = async () => null;
  prisma.setting.upsert = async ({ create, update }: any) => ({ ...create, ...update });
});

test('public register rejects privileged self-registration', async () => {
  const { POST } = await import('../src/app/api/auth/register/route');

  const response = await POST(jsonRequest('http://localhost/api/auth/register', {
    name: 'Bad Admin',
    email: 'bad-admin@example.com',
    password: 'password123',
    role: 'owner',
  }));

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Invalid role/);
});

test('login signs in an active user with a valid password', async () => {
  const { POST } = await import('../src/app/api/auth/route');
  const password = await bcrypt.hash('password123', 10);

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    password,
    name: 'Student',
    role: 'student',
    isActive: true,
  });

  const response = await POST(jsonRequest('http://localhost/api/auth', {
    email: 'student@example.com',
    password: 'password123',
  }));

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.user.password, undefined);
  assert.match(response.headers.get('set-cookie') || '', /token=/);
});

test('login is rate limited per client', async () => {
  const { POST } = await import('../src/app/api/auth/route');
  prisma.user.findUnique = async () => null;

  for (let i = 0; i < 10; i += 1) {
    const response = await POST(jsonRequest('http://localhost/api/auth', {
      email: 'missing@example.com',
      password: 'bad-password',
    }));
    assert.equal(response.status, 401);
  }

  const limited = await POST(jsonRequest('http://localhost/api/auth', {
    email: 'missing@example.com',
    password: 'bad-password',
  }));

  assert.equal(limited.status, 429);
});

test('student enrollment creation uses authenticated student id, not body studentId', async () => {
  const { POST } = await import('../src/app/api/enrollments/route');
  let createdStudentId = '';

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.course.findUnique = async () => ({
    id: 'course-1',
    status: 'active',
    capacity: 10,
    priceMinor: 100,
    currency: 'DZD',
    endDate: new Date('2027-06-01T00:00:00Z'),
  });
  prisma.enrollment.create = async ({ data }: any) => {
    createdStudentId = data.studentId;
    return {
      id: 'enrollment-1',
      enrolledAt: new Date('2026-01-01T00:00:00Z'),
      progress: data.progress,
      ...data,
      course: {
        id: data.courseId,
        title: 'Course',
        titleAr: null,
        titleFr: null,
        description: 'Course',
        category: 'language',
        level: 'beginner',
        priceMinor: 100,
        currency: 'DZD',
        capacity: 10,
        schedule: '{}',
        startDate: new Date('2026-01-01T00:00:00Z'),
        endDate: new Date('2026-06-01T00:00:00Z'),
        status: 'active',
        teacherId: 'teacher-1',
        teacher: { name: 'Teacher' },
        _count: { enrollments: 1 },
      },
    };
  };

  const response = await POST(authedRequest('http://localhost/api/enrollments', {
    studentId: 'victim-student',
    courseId: 'course-1',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 201);
  assert.equal(createdStudentId, 'student-1');
});

test('student cannot submit payment proof for another student enrollment', async () => {
  const { POST } = await import('../src/app/api/payments/route');

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.enrollment.findUnique = async () => ({
    id: 'enrollment-1',
    studentId: 'other-student',
    student: { id: 'other-student' },
    course: { priceMinor: 1000, currency: 'DZD' },
  });

  const response = await POST(authedRequest('http://localhost/api/payments', {
    enrollmentId: 'enrollment-1',
    proofKey: 'payment-proofs/student-1/proof.pdf',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 403);
});

test('payment submission derives amount from enrollment course and requires uploaded proof', async () => {
  const { POST } = await import('../src/app/api/payments/route');
  let createdPayment: any = null;

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.enrollment.findUnique = async () => ({
    id: 'enrollment-1',
    studentId: 'student-1',
    student: { id: 'student-1' },
    course: { priceMinor: 15000, currency: 'DZD' },
  });
  prisma.payment.create = async ({ data }: any) => {
    createdPayment = data;
    return { id: 'payment-1', createdAt: new Date('2026-01-01T00:00:00Z'), ...data };
  };

  const response = await POST(authedRequest('http://localhost/api/payments', {
    enrollmentId: 'enrollment-1',
    amountMinor: 1,
    proofKey: 'payment-proofs/student-1/receipt.pdf',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 200);
  assert.equal(createdPayment.amountMinor, 15000);
  assert.equal(createdPayment.currency, 'DZD');
  assert.equal(createdPayment.proofKey, 'payment-proofs/student-1/receipt.pdf');
});

test('payment submission rejects duplicate pending payment', async () => {
  const { POST } = await import('../src/app/api/payments/route');

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.enrollment.findUnique = async () => ({
    id: 'enrollment-1',
    studentId: 'student-1',
    student: { id: 'student-1' },
    course: { priceMinor: 15000, currency: 'DZD' },
  });
  prisma.payment.findFirst = async () => ({ id: 'payment-existing' });

  const response = await POST(authedRequest('http://localhost/api/payments', {
    enrollmentId: 'enrollment-1',
    proofKey: 'payment-proofs/student-1/receipt.pdf',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 409);
});

test('admin payment verification updates payment and enrollment in one transaction', async () => {
  const { PATCH } = await import('../src/app/api/payments/route');
  const operations: string[] = [];

  prisma.user.findUnique = async () => ({
    id: 'admin-1',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
  });
  prisma.payment.update = async ({ data }: any) => {
    operations.push(`payment:${data.status}:${data.verifiedBy}`);
    return { id: 'payment-1', enrollmentId: 'enrollment-1', ...data };
  };
  prisma.enrollment.update = async ({ data }: any) => {
    operations.push(`enrollment:${data.status}`);
    return { id: 'enrollment-1', ...data };
  };

  const response = await PATCH(authedRequest('http://localhost/api/payments', {
    paymentId: 'payment-1',
    status: 'verified',
  }, { id: 'admin-1', role: 'admin' }));

  assert.equal(response.status, 200);
  assert.deepEqual(operations, ['payment:verified:admin-1', 'enrollment:approved']);
});

test('teacher cannot mark attendance for another teacher course', async () => {
  const { POST } = await import('../src/app/api/attendance/route');

  prisma.user.findUnique = async () => ({
    id: 'teacher-1',
    email: 'teacher@example.com',
    role: 'teacher',
    isActive: true,
  });
  prisma.course.findUnique = async () => ({ id: 'course-1', teacherId: 'other-teacher' });

  const response = await POST(authedRequest('http://localhost/api/attendance', {
    courseId: 'course-1',
    date: '2026-01-01',
    records: [{ studentId: 'student-1', status: 'present' }],
  }, { id: 'teacher-1', role: 'teacher' }));

  assert.equal(response.status, 403);
});

test('attendance rejects records for students not enrolled in the course', async () => {
  const { POST } = await import('../src/app/api/attendance/route');

  prisma.user.findUnique = async () => ({
    id: 'teacher-1',
    email: 'teacher@example.com',
    role: 'teacher',
    isActive: true,
  });
  prisma.course.findUnique = async () => ({ id: 'course-1', teacherId: 'teacher-1' });
  prisma.enrollment.count = async () => 0;

  const response = await POST(authedRequest('http://localhost/api/attendance', {
    courseId: 'course-1',
    date: '2026-01-01',
    records: [{ studentId: 'not-enrolled', status: 'present' }],
  }, { id: 'teacher-1', role: 'teacher' }));

  assert.equal(response.status, 400);
});

test('admin can create a teacher user through users API', async () => {
  const { POST } = await import('../src/app/api/users/route');
  let createdRole = '';

  prisma.user.findUnique = async ({ where }: any) => {
    if (where.id) {
      return {
        id: 'admin-1',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      };
    }
    return null;
  };
  prisma.user.create = async ({ data }: any) => {
    createdRole = data.role;
    return { id: 'teacher-1', createdAt: new Date('2026-01-01T00:00:00Z'), ...data };
  };

  const response = await POST(authedRequest('http://localhost/api/users', {
    name: 'New Teacher',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher',
    phone: '',
  }, { id: 'admin-1', role: 'admin' }));

  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(createdRole, 'teacher');
  assert.equal(body.user.password, undefined);
});

test('admin cannot create owner user through users API', async () => {
  const { POST } = await import('../src/app/api/users/route');

  prisma.user.findUnique = async ({ where }: any) => {
    if (where.id) {
      return {
        id: 'admin-1',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      };
    }
    return null;
  };

  const response = await POST(authedRequest('http://localhost/api/users', {
    name: 'Bad Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'owner',
  }, { id: 'admin-1', role: 'admin' }));

  assert.equal(response.status, 403);
});

test('owner can create owner user through users API', async () => {
  const { POST } = await import('../src/app/api/users/route');
  let createdRole = '';

  prisma.user.findUnique = async ({ where }: any) => {
    if (where.id) {
      return {
        id: 'owner-1',
        email: 'owner@example.com',
        role: 'owner',
        isActive: true,
      };
    }
    return null;
  };
  prisma.user.create = async ({ data }: any) => {
    createdRole = data.role;
    return { id: 'owner-2', createdAt: new Date('2026-01-01T00:00:00Z'), ...data };
  };

  const response = await POST(authedRequest('http://localhost/api/users', {
    name: 'New Owner',
    email: 'new-owner@example.com',
    password: 'password123',
    role: 'owner',
  }, { id: 'owner-1', role: 'owner' }));

  assert.equal(response.status, 201);
  assert.equal(createdRole, 'owner');
});

test('non-admin cannot create users through users API', async () => {
  const { POST } = await import('../src/app/api/users/route');

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });

  const response = await POST(authedRequest('http://localhost/api/users', {
    name: 'Bad User',
    email: 'bad@example.com',
    password: 'password123',
    role: 'teacher',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 403);
});

test('public contact form creates a normalized contact message', async () => {
  const { POST } = await import('../src/app/api/contact/route');
  let createdEmail = '';

  prisma.contactMessage.create = async ({ data }: any) => {
    createdEmail = data.email;
    return {
      id: 'contact-1',
      status: 'new',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      ...data,
    };
  };

  const response = await POST(jsonRequest('http://localhost/api/contact', {
    name: ' Parent ',
    email: 'PARENT@EXAMPLE.COM',
    subject: 'Question',
    message: 'Need details',
  }));
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.equal(createdEmail, 'parent@example.com');
});

test('public contact form rejects invalid email', async () => {
  const { POST } = await import('../src/app/api/contact/route');

  const response = await POST(jsonRequest('http://localhost/api/contact', {
    name: 'Parent',
    email: 'not-an-email',
    subject: 'Question',
    message: 'Need details',
  }));

  assert.equal(response.status, 400);
});

test('non-admin cannot read contact messages', async () => {
  const { GET } = await import('../src/app/api/contact/route');

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });

  const response = await GET(authedGetRequest('http://localhost/api/contact', {
    id: 'student-1',
    role: 'student',
  }));

  assert.equal(response.status, 403);
});

test('settings PATCH updates only the authenticated user preferences', async () => {
  const { PATCH } = await import('../src/app/api/settings/route');
  let updatedUserId = '';
  let savedKey = '';

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.user.update = async ({ where, data }: any) => {
    updatedUserId = where.id;
    return {
      id: where.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      language: data.language,
      role: 'student',
      twoFactorEnabled: data.twoFactorEnabled,
    };
  };
  prisma.setting.upsert = async ({ where, create }: any) => {
    savedKey = where.key;
    return create;
  };

  const response = await PATCH(authedRequest('http://localhost/api/settings', {
    name: 'Updated Student',
    email: 'updated@example.com',
    phone: '+213555000111',
    language: 'en',
    twoFactorEnabled: true,
    preferences: { notifEmail: false, volume: 20 },
  }, { id: 'student-1', role: 'student' }));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(updatedUserId, 'student-1');
  assert.equal(savedKey, 'user:student-1:preferences');
  assert.equal(body.preferences.volume, 20);
});

test('student dashboard stats do not expose global revenue or user counts', async () => {
  const { GET } = await import('../src/app/api/dashboard/stats/route');

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.course.count = async () => 3;
  prisma.enrollment.findMany = async () => [{
    id: 'enrollment-1',
    status: 'approved',
    grade: 90,
    progress: 75,
    course: { id: 'course-1' },
  }];

  const response = await GET(authedGetRequest('http://localhost/api/dashboard/stats', {
    id: 'student-1',
    role: 'student',
  }));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.stats.totalRevenue, undefined);
  assert.equal(body.stats.totalTeachers, undefined);
  assert.equal(body.stats.enrolledCourses, 1);
});

test('admin can broadcast a notification to all active users', async () => {
  const { POST } = await import('../src/app/api/notifications/route');
  let createdCount = 0;

  prisma.user.findUnique = async () => ({
    id: 'admin-1',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
  });
  prisma.user.findMany = async () => [{ id: 'student-1' }, { id: 'teacher-1' }];
  prisma.notification.createMany = async ({ data }: any) => {
    createdCount = data.length;
    return { count: data.length };
  };

  const response = await POST(authedRequest('http://localhost/api/notifications', {
    userId: 'all',
    title: 'System update',
    message: 'Maintenance tonight',
    type: 'warning',
  }, { id: 'admin-1', role: 'admin' }));
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(createdCount, 2);
  assert.equal(body.recipientCount, 2);
});

test('student notification creation ignores spoofed recipient id', async () => {
  const { POST } = await import('../src/app/api/notifications/route');
  let createdUserId = '';

  prisma.user.findUnique = async () => ({
    id: 'student-1',
    email: 'student@example.com',
    role: 'student',
    isActive: true,
  });
  prisma.notification.create = async ({ data }: any) => {
    createdUserId = data.userId;
    return {
      id: 'notification-1',
      isRead: false,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      ...data,
    };
  };

  const response = await POST(authedRequest('http://localhost/api/notifications', {
    userId: 'victim-user',
    title: 'Note',
    message: 'Self note',
    type: 'info',
  }, { id: 'student-1', role: 'student' }));

  assert.equal(response.status, 201);
  assert.equal(createdUserId, 'student-1');
});

test('admin can create a course for an existing teacher', async () => {
  const { POST } = await import('../src/app/api/courses/route');
  let createdTeacherId = '';

  prisma.user.findUnique = async ({ where }: any) => {
    if (where.id === 'admin-1') {
      return {
        id: 'admin-1',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      };
    }
    if (where.id === 'teacher-1') {
      return {
        id: 'teacher-1',
        email: 'teacher@example.com',
        role: 'teacher',
        isActive: true,
      };
    }
    return null;
  };
  prisma.course.create = async ({ data }: any) => {
    createdTeacherId = data.teacherId;
    return {
      id: 'course-created',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      ...data,
      teacher: { id: data.teacherId, name: 'Teacher' },
      _count: { enrollments: 0 },
    };
  };

  const response = await POST(authedRequest('http://localhost/api/courses', {
    title: 'New Course',
    description: 'A real course',
    category: 'language',
    level: 'beginner',
    price: 15000,
    capacity: 25,
    teacherId: 'teacher-1',
  }, { id: 'admin-1', role: 'admin' }));

  assert.equal(response.status, 201);
  assert.equal(createdTeacherId, 'teacher-1');
});
