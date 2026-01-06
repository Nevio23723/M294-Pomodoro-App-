import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // WICHTIG
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Hier registrieren
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  
  email = '';
  password = '';

  onLogin() {
    // Hier später echte Validierung einbauen
    if (this.email && this.password) {
      console.log('Login versucht mit:', this.email);
      this.authService.login();
    }
  }
}