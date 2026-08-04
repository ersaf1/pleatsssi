import { expect, test, vi, describe, beforeEach } from 'vitest';
import { type SupabaseClient } from '@supabase/supabase-js';
import { POST as loginPOST } from '../src/app/api/auth/login/route';
import { POST as registerPOST } from '../src/app/api/auth/register/route';
import { POST as logoutPOST } from '../src/app/api/auth/logout/route';
import { supabaseServerClient } from '../src/lib/supabaseServer';

// Mock supabaseServerClient
vi.mock('../src/lib/supabaseServer', () => ({
  supabaseServerClient: vi.fn(),
}));

describe('Auth Route Handlers', () => {
  const mockSignInWithPassword = vi.fn();
  const mockSignUp = vi.fn();
  const mockSignOut = vi.fn();

  const mockSupabase = {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseServerClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient);
  });


  describe('POST /api/auth/login', () => {
    test('successful login', async () => {
      const mockSession = { user: { id: 'user-id', email: 'test@example.com' }, session: { access_token: 'token' } };
      mockSignInWithPassword.mockResolvedValue({ data: mockSession, error: null });

      const req = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });

      const response = await loginPOST(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true, data: mockSession });
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    test('failed login', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: { message: 'Invalid login credentials' } });

      const req = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
      });

      const response = await loginPOST(req);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ success: false, message: 'Invalid login credentials' });
    });

    test('internal error', async () => {
      mockSignInWithPassword.mockRejectedValue(new Error('Database error'));

      const req = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });

      const response = await loginPOST(req);
      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('Database error');
    });
  });

  describe('POST /api/auth/register', () => {
    test('successful registration', async () => {
      const mockSignUpData = { user: { id: 'new-user-id', email: 'new@example.com' } };
      mockSignUp.mockResolvedValue({ data: mockSignUpData, error: null });

      const req = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', password: 'password123', name: 'John Doe' }),
      });

      const response = await registerPOST(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true, data: mockSignUpData });
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: { data: { name: 'John Doe' } },
      });
    });

    test('failed registration', async () => {
      mockSignUp.mockResolvedValue({ data: { user: null }, error: { message: 'User already registered' } });

      const req = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', password: 'password123', name: 'John Doe' }),
      });

      const response = await registerPOST(req);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ success: false, message: 'User already registered' });
    });
  });

  describe('POST /api/auth/logout', () => {
    test('successful logout', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const response = await logoutPOST();
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true });
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
