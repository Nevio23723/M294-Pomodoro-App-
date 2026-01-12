import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  error = '';

  constructor() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.error = '';
    if (this.email && this.password) {
      const success = this.authService.login(this.email, this.password);
      if (!success) {
        this.error = 'Login fehlgeschlagen';
      }
    } else {
      this.error = 'Bitte E-Mail und Passwort eingeben';
    }
  }
}