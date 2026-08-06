import { expect, test, vi, describe, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';
import { createServerClient } from '@supabase/ssr';
import { isSupabaseConfigured } from '../src/lib/services/serviceUtils';

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

// Mock serviceUtils
vi.mock('../src/lib/services/serviceUtils', () => ({
  isSupabaseConfigured: vi.fn().mockReturnValue(true),
}));

describe('Admin Authentication Middleware Guard', () => {
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isSupabaseConfigured).mockReturnValue(true);

    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
      from: mockFrom,
    } as unknown as ReturnType<typeof createServerClient>);
  });

  test('bypasses middleware if Supabase is unconfigured', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    const req = new NextRequest('http://localhost/id/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(createServerClient).not.toHaveBeenCalled();
  });

  test('redirects unauthenticated user accessing /id/admin/dashboard to /id/admin/login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest('http://localhost/id/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/id/admin/login');
  });

  test('allows unauthenticated user accessing /id/admin/login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest('http://localhost/id/admin/login');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  test('redirects authenticated customer role accessing /id/admin/dashboard with error param', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'cust-123', user_metadata: { role: 'customer' } },
      },
    });

    const mockSingle = vi.fn().mockResolvedValue({ data: { role: 'customer' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });

    const req = new NextRequest('http://localhost/id/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/id/admin/login?error=access_denied');
  });

  test('allows authenticated admin role accessing /id/admin/dashboard', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'admin-123', user_metadata: { role: 'admin' } },
      },
    });

    const req = new NextRequest('http://localhost/id/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  test('allows authenticated owner role via database fallback query', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'owner-123', user_metadata: {} },
      },
    });

    const mockSingle = vi.fn().mockResolvedValue({ data: { role: 'owner' } });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });

    const req = new NextRequest('http://localhost/id/admin/dashboard');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith('users');
  });

  test('redirects authenticated admin accessing /id/admin/login to /id/admin/dashboard', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'admin-123', user_metadata: { role: 'admin' } },
      },
    });

    const req = new NextRequest('http://localhost/id/admin/login');
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/id/admin/dashboard');
  });
});
