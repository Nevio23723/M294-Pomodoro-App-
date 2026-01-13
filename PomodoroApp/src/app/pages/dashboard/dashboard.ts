import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
})
export class Dashboard {
    authService = inject(AuthService);
    router = inject(Router);

    timerOptions = [
        {
            duration: 10,
            title: 'Kurze Session',
            description: 'Perfekt für kleine Aufgaben',
            icon: '⚡',
            color: '#22c55e'
        },
        {
            duration: 30,
            title: 'Standard Session',
            description: 'Die klassische Pomodoro-Technik',
            icon: '🍅',
            color: '#ef4444'
        },
        {
            duration: 60,
            title: 'Tiefe Arbeit',
            description: 'Für maximale Konzentration',
            icon: '🚀',
            color: '#8b5cf6'
        }
    ];

    selectTimer(duration: number) {
        this.router.navigate(['/timer', duration]);
    }

    logout() {
        this.authService.logout();
    }
}
