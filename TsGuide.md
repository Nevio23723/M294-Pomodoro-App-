# TypeScript & Angular Guide

Ein umfassender Leitfaden für TypeScript und Angular Komponenten-Entwicklung.

---

## 1. TypeScript Grundlagen

### Typisierung

```typescript
// Primitive Typen
let name: string = 'Max';
let age: number = 25;
let isActive: boolean = true;

// Arrays
let items: string[] = ['a', 'b', 'c'];
let numbers: Array<number> = [1, 2, 3];

// Objekte und Interfaces
interface User {
    id: number;
    email: string;
    role?: string; // Optional
}

const user: User = { id: 1, email: 'test@mail.ch' };
```

### Klassen

```typescript
class Person {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    greet(): string {
        return `Hallo, ${this.name}`;
    }
}
```

### Generics

```typescript
// Generische Funktion
function identity<T>(value: T): T {
    return value;
}

// Generisches Interface
interface ApiResponse<T> {
    data: T;
    status: number;
}
```

---

## 2. Angular Komponenten

### Aufbau einer Komponente

Jede Angular-Komponente besteht aus:

| Datei | Zweck |
|-------|-------|
| `.ts` | Logik (Klasse, Variablen, Funktionen) |
| `.html` | Template (Struktur, Anzeige) |
| `.css/.scss` | Styling (komponentenspezifisch) |
| `.spec.ts` | Unit-Tests |

### Component Decorator

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-example',      // HTML-Tag-Name
    standalone: true,             // Standalone Component (v17+)
    imports: [CommonModule],      // Abhängigkeiten
    templateUrl: './example.html',
    styleUrl: './example.css'
})
export class ExampleComponent {
    title = 'Beispiel';
}
```

### Standalone vs. Module-basiert

| Feature | `standalone: true` | `standalone: false` |
|---------|-------------------|---------------------|
| Abhängigkeiten | Selbst verwaltet via `imports` | Über NgModule |
| NgModule nötig? | ❌ Nein | ✅ Ja |
| Tree-shaking | ✅ Optimal | ⚠️ Eingeschränkt |
| Standard ab v17 | ✅ Ja | ❌ Nein |

---

## 3. Datenbindung (Data Binding)

### Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                     DATA BINDING                            │
├─────────────────────────────────────────────────────────────┤
│  TS → View:    Interpolation {{ }}  / Property [ ]          │
│  View → TS:    Event Binding ( )                            │
│  TS ↔ View:    Two-Way Binding [( )]                        │
└─────────────────────────────────────────────────────────────┘
```

### Interpolation (TS → View)

Zeigt Werte aus der Komponente im Template an:

```html
<h1>{{ title }}</h1>
<p>Willkommen, {{ user.name }}</p>
<span>{{ getFullName() }}</span>
```

### Property Binding (TS → View)

Bindet Werte an DOM-Eigenschaften:

```html
<button [disabled]="isLoading">Speichern</button>
<img [src]="imageUrl" [alt]="imageAlt">
<div [style.color]="textColor">Text</div>
<input [value]="userName">
```

### Event Binding (View → TS)

Reagiert auf DOM-Events:

```html
<button (click)="saveData()">Speichern</button>
<input (input)="onInputChange($event)">
<form (submit)="onSubmit()">
<div (mouseover)="onHover()">Hover me</div>
```

### Two-Way Binding (TS ↔ View)

Synchronisiert Daten in beide Richtungen:

```typescript
// Component
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule],
    // ...
})
export class FormComponent {
    email = '';
    password = '';
}
```

```html
<!-- Template -->
<input [(ngModel)]="email" name="email">
<input [(ngModel)]="password" name="password">
```

> [!IMPORTANT]
> Für `[(ngModel)]` muss `FormsModule` importiert werden!

---

## 4. Direktiven

### Attribute Directives

Verändern das Aussehen oder Verhalten von Elementen:

```html
<!-- ngClass: Klassen dynamisch hinzufügen -->
<div [ngClass]="{'error': hasError, 'success': isValid}">
    Status
</div>

<!-- ngStyle: Styles dynamisch setzen -->
<p [ngStyle]="{'color': isActive ? 'green' : 'red'}">
    Text
</p>
```

### Control Flow (Neue Syntax ab Angular 17+)

#### @if - Bedingte Anzeige

```html
@if (isLoggedIn) {
    <nav>Navigation anzeigen</nav>
} @else if (isGuest) {
    <p>Willkommen, Gast!</p>
} @else {
    <button>Anmelden</button>
}
```

#### @for - Schleifen

```html
<ul>
    @for (item of items; track item.id) {
        <li>{{ item.name }}</li>
    }
</ul>

<!-- Mit Index -->
@for (user of users; track user.id; let i = $index) {
    <p>{{ i + 1 }}. {{ user.name }}</p>
}
```

> [!TIP]
> `track` hilft Angular, die Liste performant zu rendern, indem es Elemente anhand einer eindeutigen ID identifiziert.

#### @switch - Mehrfachauswahl

```html
@switch (status) {
    @case ('loading') {
        <spinner></spinner>
    }
    @case ('success') {
        <result-view></result-view>
    }
    @default {
        <error-message></error-message>
    }
}
```

---

## 5. Routing

### Konfiguration (app.routes.ts)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
    // Redirect
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    
    // Einfache Route
    { path: 'home', component: HomeComponent },
    
    // Lazy Loading
    { 
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard')
            .then(m => m.Dashboard)
    },
    
    // Route mit Parameter
    { path: 'user/:id', component: UserDetailComponent },
    
    // Route mit Guard
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [authGuard]
    },
    
    // Wildcard (404)
    { path: '**', redirectTo: '/home' }
];
```

### App Config (app.config.ts)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient()
    ]
};
```

### Navigation im Template

```html
<!-- RouterLink für SPA-Navigation -->
<a routerLink="/home">Home</a>
<a routerLink="/user/123">User 123</a>
<a [routerLink]="['/user', userId]">Dynamisch</a>

<!-- Router Outlet (Platzhalter) -->
<router-outlet></router-outlet>
```

### Navigation im Code

```typescript
import { Router } from '@angular/router';

export class NavigationComponent {
    router = inject(Router);
    
    goToHome() {
        this.router.navigate(['/home']);
    }
    
    goToUser(id: number) {
        this.router.navigate(['/user', id]);
    }
}
```

### Route Parameter auslesen

```typescript
import { ActivatedRoute } from '@angular/router';

export class UserComponent implements OnInit {
    route = inject(ActivatedRoute);
    
    ngOnInit() {
        // Snapshot (einmalig)
        const id = this.route.snapshot.paramMap.get('id');
        
        // Observable (reaktiv bei Änderungen)
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
        });
    }
}
```

---

## 6. Guards (Route Protection)

### Auth Guard (Functional Style)

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.isLoggedIn()) {
        return true;
    } else {
        // Redirect zum Login
        return router.createUrlTree(['/login']);
    }
};
```

### Guard verwenden

```typescript
// In app.routes.ts
{
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
}
```

---

## 7. Services

### Service erstellen

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root' // Singleton für die ganze App
})
export class DataService {
    private http = inject(HttpClient);
    
    getData(): Observable<Data[]> {
        return this.http.get<Data[]>('/api/data');
    }
}
```

### Service verwenden (Dependency Injection)

```typescript
export class MyComponent {
    // Neuer Weg: inject()
    private dataService = inject(DataService);
    
    // Klassischer Weg: Konstruktor
    // constructor(private dataService: DataService) {}
    
    loadData() {
        this.dataService.getData().subscribe(data => {
            console.log(data);
        });
    }
}
```

---

## 8. Signals (State Management)

### Signal erstellen und verwenden

```typescript
import { signal, computed } from '@angular/core';

export class CounterComponent {
    // Signal erstellen
    count = signal(0);
    
    // Computed Signal (abgeleitet)
    doubleCount = computed(() => this.count() * 2);
    
    increment() {
        // Wert lesen: count()
        // Wert setzen: count.set()
        this.count.set(this.count() + 1);
        
        // Oder mit update()
        this.count.update(v => v + 1);
    }
}
```

```html
<!-- Im Template -->
<p>Count: {{ count() }}</p>
<p>Double: {{ doubleCount() }}</p>
```

---

## 9. Lifecycle Hooks

```typescript
export class LifecycleComponent implements OnInit, OnDestroy {
    
    ngOnInit() {
        // Komponente wurde initialisiert
        // Ideal für: API-Calls, Subscriptions starten
    }
    
    ngOnDestroy() {
        // Komponente wird zerstört
        // Ideal für: Cleanup, Subscriptions beenden
    }
}
```

| Hook | Wann? | Typische Verwendung |
|------|-------|---------------------|
| `ngOnInit` | Nach Initialisierung | Daten laden |
| `ngOnChanges` | Input-Werte ändern sich | Auf Änderungen reagieren |
| `ngOnDestroy` | Vor dem Entfernen | Aufräumen, Unsubscribe |

---

## 10. Formulare

### Template-Driven Forms

```typescript
// Component
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule],
    // ...
})
export class LoginComponent {
    email = '';
    password = '';
    
    onSubmit() {
        console.log(this.email, this.password);
    }
}
```

```html
<form (ngSubmit)="onSubmit()">
    <input [(ngModel)]="email" name="email" required>
    <input [(ngModel)]="password" name="password" required>
    <button type="submit">Login</button>
</form>
```

### Reactive Forms

```typescript
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    imports: [ReactiveFormsModule],
    // ...
})
export class ContactComponent {
    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        message: new FormControl('')
    });
    
    onSubmit() {
        if (this.form.valid) {
            console.log(this.form.value);
        }
    }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
    <input formControlName="name">
    @if (form.get('name')?.invalid && form.get('name')?.touched) {
        <span class="error">Name ist erforderlich</span>
    }
    
    <input formControlName="email">
    <textarea formControlName="message"></textarea>
    
    <button [disabled]="form.invalid">Senden</button>
</form>
```

---

## 11. HTTP Client

### Setup in app.config.ts

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient()
    ]
};
```

### HTTP Requests

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    
    // GET
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('/api/users');
    }
    
    // POST
    createUser(user: User): Observable<User> {
        return this.http.post<User>('/api/users', user);
    }
    
    // PUT
    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`/api/users/${id}`, user);
    }
    
    // DELETE
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`/api/users/${id}`);
    }
}
```

---

## 12. Wichtige CLI-Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `ng new projektname` | Neues Projekt erstellen |
| `npm install` | Abhängigkeiten installieren |
| `ng serve` | Dev-Server starten |
| `ng build` | Produktions-Build |
| `ng g c name` | Komponente generieren |
| `ng g s name` | Service generieren |
| `ng g guard name` | Guard generieren |

---

## 13. Projektstruktur

```
src/
├── index.html          # Einzige HTML-Datei (SPA)
├── main.ts             # Einstiegspunkt (Bootstrap)
├── app/
│   ├── app.ts          # Root-Komponente
│   ├── app.html
│   ├── app.css
│   ├── app.config.ts   # Globale Konfiguration
│   ├── app.routes.ts   # Routing-Definitionen
│   ├── auth/           # Auth-Modul
│   │   ├── auth.guard.ts
│   │   └── auth.service.ts
│   ├── services/       # Globale Services
│   └── pages/          # Seiten-Komponenten
│       ├── home/
│       ├── dashboard/
│       └── ...
```
