import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal für den Login-Status
  isLoggedIn = signal<boolean>(false);

  constructor(private router: Router) {}

  login() {
    this.isLoggedIn.set(true);
    this.router.navigate(['/timer']);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}