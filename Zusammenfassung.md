# Pomodoro App - Zusammenfassung mit Projekt-Beispielen

Diese Zusammenfassung zeigt Angular-Konzepte anhand konkreter Beispiele aus dem **Pomodoro App** Projekt.

---

## 1. Projektinitialisierung

**Initialisierung:** `ng new projektname` erstellt ein neues Projekt.

### Standalone Components

In diesem Projekt verwenden alle Komponenten `standalone: true`:

```typescript
// src/app/pages/login/login.ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // ...
}
```

| Feature | Projekt-Beispiel |
|---------|-----------------|
| `standalone: true` | Alle Komponenten (Login, Dashboard, Timer) |
| `imports` Array | `FormsModule` in Login für Two-Way Binding |
| Kein NgModule | Das Projekt hat kein `app.module.ts` |

### Wichtige Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm install` | Installiert alle Abhängigkeiten aus `package.json` |
| `ng serve` | Startet den lokalen Entwicklungsserver |
| `ng g c name` | Erstellt eine Komponente |
| `ng g s name` | Erstellt einen Service |

---

## 2. Komponenten und Aufbau

### Dateien einer Komponente

Am Beispiel der **Timer-Komponente**:

```
src/app/pages/timer/
├── timer.ts          # Logik (Klasse, Timer-Funktionen)
├── timer.html        # Template (Anzeige, Buttons)
├── timer.css         # Styling (nur für Timer)
└── timer.spec.ts     # Tests für Timer
```

### Projekt-Aufbau

```
PomodoroApp/src/
├── index.html          # Einzige HTML-Datei (SPA)
├── main.ts             # Einstiegspunkt, startet die App
├── app/
│   ├── app.ts          # Root-Komponente mit <router-outlet>
│   ├── app.config.ts   # Globale Konfiguration (Router, HTTP)
│   ├── app.routes.ts   # Routing-Definitionen
│   ├── auth/           # Auth Guard & Service
│   ├── services/       # QuotesService
│   └── pages/          # Login, Dashboard, Timer
```

### app.config.ts - Globale Konfiguration

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};
```

---

## 3. Datenbindung und Direktiven

### One-way Binding (TS → View)

#### Interpolation `{{ }}`

```html
<!-- src/app/pages/dashboard/dashboard.html -->
<h3>{{ option.title }}</h3>
<p class="duration">{{ option.duration }} Minuten</p>
<p class="description">{{ option.description }}</p>
```

```html
<!-- src/app/pages/timer/timer.html -->
<span class="time">{{ formatTime(minutes()) }}:{{ formatTime(seconds()) }}</span>
<span class="label">{{ isRunning() ? 'Fokus' : 'Bereit' }}</span>
```

#### Property Binding `[ ]`

```html
<!-- src/app/pages/timer/timer.html -->
<circle class="progress-bar" 
        [style.stroke-dashoffset]="strokeDashoffset()"
        transform="rotate(-90 150 150)" />
```

### One-way Binding (View → TS)

#### Event Binding `( )`

```html
<!-- src/app/pages/dashboard/dashboard.html -->
<button class="logout-btn" (click)="logout()">Abmelden</button>
<button class="timer-card" (click)="selectTimer(option.duration)">...</button>

<!-- src/app/pages/timer/timer.html -->
<button class="control-btn primary" (click)="toggleTimer()">...</button>
<button class="control-btn secondary" (click)="resetTimer()">...</button>
```

### Two-Way Binding `[( )]`

```html
<!-- src/app/pages/login/login.html -->
<input type="email" 
       id="email" 
       name="email" 
       [(ngModel)]="email" 
       required 
       placeholder="name@beispiel.ch">

<input type="password" 
       id="password" 
       name="password" 
       [(ngModel)]="password" 
       required>
```

```typescript
// src/app/pages/login/login.ts
export class Login {
  email = '';
  password = '';
  
  onLogin() {
    if (this.email && this.password) {
      // email und password sind synchron mit den Input-Feldern
      this.authService.login(this.email, this.password);
    }
  }
}
```

> [!IMPORTANT]
> Für `[(ngModel)]` muss `FormsModule` importiert werden:
> ```typescript
> imports: [FormsModule]
> ```

### Attribute Directives

Im Projekt werden keine expliziten `[ngClass]` oder `[ngStyle]` verwendet, aber hier ist die Syntax:

```html
[ngClass]="{'error': hatFehler}"      <!-- Klasse bedingt hinzufügen -->
[ngStyle]="{'color': farbe}"          <!-- Style dynamisch setzen -->
```

### Control Flow (Neue Syntax)

#### @if

```html
<!-- src/app/pages/login/login.html -->
@if (error) {
  <div class="error-message">{{ error }}</div>
}

<!-- src/app/pages/timer/timer.html -->
@if (!isCompleted()) {
  <div class="timer-display">...</div>
} @else {
  <div class="completion-screen">...</div>
}

@if (quote()) {
  <div class="quote-card">
    <p class="quote-text">"{{ quote()?.text }}"</p>
    <p class="quote-author">— {{ quote()?.author }}</p>
  </div>
} @else {
  <div class="quote-loading">Lade Zitat...</div>
}
```

#### @for

```html
<!-- src/app/pages/dashboard/dashboard.html -->
@for (option of timerOptions; track option.duration) {
  <button class="timer-card" (click)="selectTimer(option.duration)">
    <div class="card-content">
      <h3>{{ option.title }}</h3>
      <p class="duration">{{ option.duration }} Minuten</p>
      <p class="description">{{ option.description }}</p>
    </div>
  </button>
}
```

> [!TIP]
> `track option.duration` hilft Angular, die Liste performant zu rendern.

#### @if / @else if / @else in @for

```html
<!-- src/app/pages/dashboard/dashboard.html -->
@for (option of timerOptions; track option.duration) {
  <button class="timer-card">
    <div class="card-icon">
      <svg viewBox="0 0 24 24">
        @if (option.duration === 15) {
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        } @else if (option.duration === 30) {
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        } @else {
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
        }
      </svg>
    </div>
  </button>
}
```

---

## 4. Routing und Sicherheit

### Einrichtung (app.routes.ts)

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    // Redirect zur Login-Seite
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Login-Seite (Lazy Loading)
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    
    // Dashboard mit Guard-Schutz
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
    },
    
    // Timer mit Parameter (duration)
    {
        path: 'timer/:duration',
        loadComponent: () => import('./pages/timer/timer').then(m => m.Timer),
        canActivate: [authGuard]
    },
    
    // Wildcard - alle unbekannten Pfade → Login
    { path: '**', redirectTo: '/login' }
];
```

### Navigation

#### Im TypeScript-Code

```typescript
// src/app/pages/dashboard/dashboard.ts
selectTimer(duration: number) {
    this.router.navigate(['/timer', duration]);
}

// src/app/pages/timer/timer.ts
goBack() {
    this.stopTimer();
    this.router.navigate(['/dashboard']);
}
```

#### Router Outlet

```html
<!-- src/app/app.html -->
<router-outlet></router-outlet>
```

Der `<router-outlet>` ist der Platzhalter, an dem die aktive Komponente angezeigt wird.

### Route-Parameter auslesen

```typescript
// src/app/pages/timer/timer.ts
export class Timer implements OnInit {
  private route = inject(ActivatedRoute);
  
  totalSeconds = signal(0);
  remainingSeconds = signal(0);

  ngOnInit() {
    // Parameter aus der URL lesen: /timer/25 → duration = 25
    const duration = Number(this.route.snapshot.paramMap.get('duration')) || 25;
    this.totalSeconds.set(duration * 60);
    this.remainingSeconds.set(duration * 60);
  }
}
```

### Guards (Sicherheit)

```typescript
// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;  // Zugriff erlaubt
  } else {
    // Nicht eingeloggt → Redirect zum Login
    return router.createUrlTree(['/login']);
  }
};
```

**Ablauf:**
1. User klickt auf geschützte Route (z.B. `/dashboard`)
2. Guard prüft `authService.isLoggedIn()`
3. `return true` → Zugriff erlaubt
4. `return router.createUrlTree(['/login'])` → Redirect zum Login

---

## 5. Services

### AuthService

```typescript
// src/app/auth/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'  // Singleton für die ganze App
})
export class AuthService {
  private readonly TOKEN_KEY = 'pomodoro_auth_token';

  // Signal für reactive State
  isLoggedIn = signal<boolean>(this.hasValidToken());

  constructor(private router: Router) {}

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  login(email: string, password: string): boolean {
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
}
```

### QuotesService (HTTP)

```typescript
// src/app/services/quotes.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Quote {
    text: string;
    author: string;
}

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private http = inject(HttpClient);

    private fallbackQuotes: Quote[] = [
        { text: 'Der Anfang ist die Hälfte des Ganzen.', author: 'Aristoteles' },
        // ... weitere Zitate
    ];

    getRandomQuote(): Observable<Quote> {
        return this.http.get<any[]>('https://api.allorigins.win/raw?url=...')
            .pipe(
                map(response => ({
                    text: response[0].q,
                    author: response[0].a
                })),
                catchError(() => of(this.getRandomFallback()))
            );
    }

    private getRandomFallback(): Quote {
        const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
        return this.fallbackQuotes[randomIndex];
    }
}
```

### Service verwenden (Dependency Injection)

```typescript
// Neuer Weg: inject()
export class Timer {
  private quotesService = inject(QuotesService);
  
  fetchQuote() {
    this.quotesService.getRandomQuote().subscribe(q => {
      this.quote.set(q);
    });
  }
}
```

---

## 6. Signals (State Management)

### Signals im Timer

```typescript
// src/app/pages/timer/timer.ts
import { signal, computed } from '@angular/core';

export class Timer {
  // Einfache Signals
  totalSeconds = signal(0);
  remainingSeconds = signal(0);
  isRunning = signal(false);
  isCompleted = signal(false);
  quote = signal<Quote | null>(null);

  // Computed Signals (automatisch berechnet)
  minutes = computed(() => Math.floor(this.remainingSeconds() / 60));
  seconds = computed(() => this.remainingSeconds() % 60);
  
  progress = computed(() => {
    const total = this.totalSeconds();
    if (total === 0) return 0;
    return ((total - this.remainingSeconds()) / total) * 100;
  });

  strokeDashoffset = computed(() => {
    const circumference = 2 * Math.PI * 140;
    return circumference - (this.progress() / 100) * circumference;
  });

  // Signal-Werte ändern
  startTimer() {
    this.isRunning.set(true);  // Wert setzen
  }

  updateTimer() {
    this.remainingSeconds.update(v => v - 1);  // Wert basierend auf vorherigem Wert
  }
}
```

### Signals im Template

```html
<!-- src/app/pages/timer/timer.html -->
<span class="time">{{ formatTime(minutes()) }}:{{ formatTime(seconds()) }}</span>
<span class="label">{{ isRunning() ? 'Fokus' : 'Bereit' }}</span>

<!-- Signal in Bedingung -->
@if (!isCompleted()) {
  <div class="timer-display">...</div>
}
```

> [!NOTE]
> Signals werden mit `()` aufgerufen, um den aktuellen Wert zu lesen.

---

## 7. Formulare

### Template-Driven Form (Login)

```typescript
// src/app/pages/login/login.ts
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  error = '';

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
```

```html
<!-- src/app/pages/login/login.html -->
<form (ngSubmit)="onLogin()" class="login-form">
  @if (error) {
    <div class="error-message">{{ error }}</div>
  }

  <div class="form-group">
    <label for="email">E-Mail</label>
    <input type="email" 
           id="email" 
           name="email" 
           [(ngModel)]="email" 
           required 
           placeholder="name@beispiel.ch">
  </div>

  <div class="form-group">
    <label for="password">Passwort</label>
    <input type="password" 
           id="password" 
           name="password" 
           [(ngModel)]="password" 
           required>
  </div>

  <button type="submit" class="login-btn">
    <span>Anmelden</span>
  </button>
</form>
```

---

## 8. Lifecycle Hooks

```typescript
// src/app/pages/timer/timer.ts
export class Timer implements OnInit, OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    // Komponente initialisiert → Timer-Dauer aus Route lesen
    const duration = Number(this.route.snapshot.paramMap.get('duration')) || 25;
    this.totalSeconds.set(duration * 60);
    this.remainingSeconds.set(duration * 60);
  }

  ngOnDestroy() {
    // Komponente wird zerstört → Timer stoppen
    this.stopTimer();
  }
}
```

---

## 9. Antworten für das Beispielszenario

### Frage: Wie würden Sie ein Formular einbauen?

> "Für ein Kontaktformular würde ich **Reactive Forms** verwenden, da es mehr Kontrolle bietet. Ich erstelle eine `FormGroup` mit `FormControl` für Name, Telefon, E-Mail und Anfrage. Auf das E-Mail-Feld lege ich `Validators.email` und auf alle Pflichtfelder `Validators.required`. Beim Absenden mit `(ngSubmit)` prüfe ich `this.form.valid` und sende die Daten an einen Service."

```typescript
form = new FormGroup({
  name: new FormControl('', [Validators.required]),
  phone: new FormControl(''),
  email: new FormControl('', [Validators.required, Validators.email]),
  message: new FormControl('', [Validators.required])
});
```

### Frage: Welche Komponenten würden Sie erstellen?

> "Ich würde das modular halten. Eine `ContactPageComponent` als Container und darin eine wiederverwendbare `ContactFormComponent`. So könnte ich das Formular später auch an anderer Stelle (z.B. im Footer oder Modal) nutzen."

### Frage: Welche Routen erstellen Sie?

> "Ich definiere in den Routes einen Pfad `path: 'kontakt'`, der die `ContactPageComponent` lädt. Für die Navigation nutze ich in der Navbar das `routerLink`-Attribut, damit die App nicht neu lädt (Single Page Application)."

```typescript
// In app.routes.ts
{
  path: 'kontakt',
  loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
}
```

```html
<!-- In der Navigation -->
<a routerLink="/kontakt">Kontakt</a>
```

---

## 10. Projekt-Übersicht

```
┌──────────────────────────────────────────────────────────────────┐
│                        POMODORO APP                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│    /login          →  Login Component                            │
│         │                                                        │
│         │ authService.login()                                    │
│         ▼                                                        │
│    /dashboard      →  Dashboard Component  [🔒 authGuard]        │
│         │                                                        │
│         │ selectTimer(duration)                                  │
│         ▼                                                        │
│    /timer/:duration →  Timer Component     [🔒 authGuard]        │
│         │                                                        │
│         │ quotesService.getRandomQuote()                         │
│         ▼                                                        │
│    Quote anzeigen                                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Wichtige Konzepte im Projekt

| Konzept | Wo verwendet |
|---------|--------------|
| Standalone Components | Alle Komponenten |
| Two-Way Binding | Login-Formular |
| Event Binding | Buttons (click) |
| Interpolation | Alle Templates |
| @if / @else | Timer, Login, Dashboard |
| @for mit track | Dashboard Timer-Optionen |
| Routing mit Guards | Dashboard, Timer |
| Route-Parameter | Timer (`:duration`) |
| Lazy Loading | Alle Seiten |
| Signals | Timer State |
| Computed Signals | Timer-Berechnungen |
| Services | AuthService, QuotesService |
| HTTP Client | QuotesService |
| Lifecycle Hooks | Timer (OnInit, OnDestroy) |
