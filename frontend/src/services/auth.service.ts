// src/services/auth.service.ts

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user_id: string;
  name: string;
}

class AuthService {
  private baseUrl = `${import.meta.env.VITE_API_URL}`;  // No `/auth` here

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Login failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    return result;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Registration failed');
    }

    const result = await response.json();

    // Optional: auto login
    localStorage.setItem('auth_token', result.token);
    return result;
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export type { LoginRequest, RegisterRequest, AuthResponse };
