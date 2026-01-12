import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'pomodoro_auth_token';

  // Signal für den Login-Status
  isLoggedIn = signal<boolean>(this.hasValidToken());

  constructor(private router: Router) {
    // Auto-login check on service init
    if (this.hasValidToken()) {
      this.isLoggedIn.set(true);
    }
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  private generateToken(email: string): string {
    // Create a simple JWT-like token for local demo
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('local-demo-signature');
    return `${header}.${payload}.${signature}`;
  }

  login(email: string, password: string): boolean {
    // For demo: accept any non-empty credentials
    if (email && password) {
      const token = this.generateToken(email);
      localStorage.setItem(this.TOKEN_KEY, token);
      this.isLoggedIn.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getEmail(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }
}