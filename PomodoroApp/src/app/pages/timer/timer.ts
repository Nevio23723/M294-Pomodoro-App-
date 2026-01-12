import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotesService, Quote } from '../../services/quotes.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.css'
})
export class Timer implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quotesService = inject(QuotesService);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Total duration in seconds
  totalSeconds = signal(0);
  remainingSeconds = signal(0);
  isRunning = signal(false);
  isCompleted = signal(false);
  quote = signal<Quote | null>(null);

  // Computed values
  minutes = computed(() => Math.floor(this.remainingSeconds() / 60));
  seconds = computed(() => this.remainingSeconds() % 60);
  progress = computed(() => {
    const total = this.totalSeconds();
    if (total === 0) return 0;
    return ((total - this.remainingSeconds()) / total) * 100;
  });
  strokeDashoffset = computed(() => {
    const circumference = 2 * Math.PI * 140; // radius = 140
    return circumference - (this.progress() / 100) * circumference;
  });

  ngOnInit() {
    const duration = Number(this.route.snapshot.paramMap.get('duration')) || 25;
    this.totalSeconds.set(duration * 60);
    this.remainingSeconds.set(duration * 60);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  toggleTimer() {
    if (this.isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds() > 0) {
        this.remainingSeconds.update(v => v - 1);
      } else {
        this.completeTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stopTimer() {
    this.pauseTimer();
  }

  resetTimer() {
    this.stopTimer();
    this.remainingSeconds.set(this.totalSeconds());
    this.isCompleted.set(false);
    this.quote.set(null);
  }

  completeTimer() {
    this.stopTimer();
    this.isCompleted.set(true);
    this.fetchQuote();
  }

  fetchQuote() {
    this.quotesService.getRandomQuote().subscribe(q => {
      this.quote.set(q);
    });
  }

  goBack() {
    this.stopTimer();
    this.router.navigate(['/dashboard']);
  }

  startNewSession() {
    this.resetTimer();
  }

  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
