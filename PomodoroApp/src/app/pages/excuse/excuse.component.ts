import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExcuseService, ExcuseResult } from '../../services/excuse.service';

@Component({
  selector: 'app-excuse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="excuse-page">
      <header class="page-header">
        <a routerLink="/dashboard" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Zurück
        </a>
        <h1>Abwesenheits-Assistent</h1>
      </header>

      <main class="page-content">
        <div class="card">
          <div class="card-header">
            <h2>Nachricht generieren</h2>
            <p>Erstelle eine Abwesenheitsmeldung für die Schule</p>
          </div>

          <div class="form-group">
            <label for="recipientEmail">Empfänger</label>
            <input 
              type="email" 
              id="recipientEmail"
              [(ngModel)]="recipientEmail"
              placeholder="lehrer@schule.ch"
              class="input"
            />
          </div>

          @if (recipientEmail) {
            <div class="preview-badge">
              Wird gesendet an: {{ recipientEmail }}
            </div>
          }

          <button 
            class="btn btn-primary" 
            (click)="generateExcuse()" 
            [disabled]="isLoading() || !recipientEmail">
            @if (isLoading()) {
              <span class="spinner"></span>
              Generiere...
            } @else {
              Nachricht generieren
            }
          </button>

          @if (error()) {
            <div class="alert alert-error">
              {{ error() }}
            </div>
          }
        </div>

        @if (excuseResult()) {
          <div class="card result-card">
            <div class="card-header">
              <h2>Generierte Nachricht</h2>
            </div>

            <div class="result-row">
              <span class="result-label">Original (EN)</span>
              <p class="result-text">{{ excuseResult()?.originalExcuse }}</p>
            </div>
            
            <div class="result-row">
              <span class="result-label">Übersetzung (DE)</span>
              <p class="result-text result-highlight">{{ excuseResult()?.translatedExcuse }}</p>
            </div>

            <div class="result-row">
              <span class="result-label">Empfänger</span>
              <p class="result-text result-email">{{ recipientEmail }}</p>
            </div>

            <div class="card-footer">
              <span class="success-indicator"></span>
              E-Mail-Fenster wurde geöffnet
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .excuse-page {
      min-height: 100vh;
      background: var(--bg-dark);
      padding: 1.5rem;
    }

    .page-header {
      max-width: 480px;
      margin: 0 auto 2rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-decoration: none;
      margin-bottom: 1rem;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--text-primary);
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .page-content {
      max-width: 480px;
      margin: 0 auto;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .card-header {
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem;
    }

    .card-header p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .input {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      background: var(--bg-dark);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .input::placeholder {
      color: var(--text-muted);
    }

    .preview-badge {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      background: var(--bg-dark);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-light);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .result-card {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-row {
      margin-bottom: 1.25rem;
    }

    .result-row:last-of-type {
      margin-bottom: 0;
    }

    .result-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.375rem;
    }

    .result-text {
      margin: 0;
      font-size: 0.9375rem;
      color: var(--text-primary);
      line-height: 1.5;
    }

    .result-highlight {
      background: var(--bg-dark);
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 3px solid var(--primary);
    }

    .result-email {
      font-family: monospace;
      color: var(--text-secondary);
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .success-indicator {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
    }
  `]
})
export class ExcuseComponent {
  private readonly excuseService = inject(ExcuseService);

  // Two-Way Data Binding für die E-Mail-Adresse
  recipientEmail = 'lehrer@schule.ch';

  // Signals für reaktiven State
  isLoading = signal(false);
  error = signal<string | null>(null);
  excuseResult = signal<ExcuseResult | null>(null);

  /**
   * Generiert eine Ausrede, übersetzt sie und öffnet das E-Mail-Fenster.
   */
  generateExcuse(): void {
    if (!this.recipientEmail || !this.recipientEmail.includes('@')) {
      this.error.set('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.excuseService.getExcuseAndOpenMail(this.recipientEmail).subscribe({
      next: (result) => {
        this.excuseResult.set(result);
        this.isLoading.set(false);
        this.excuseService.openMailClient(result.mailtoLink);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
