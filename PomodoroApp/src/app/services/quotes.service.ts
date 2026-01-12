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

    // Fallback quotes in case API fails
    private fallbackQuotes: Quote[] = [
        { text: 'Der Anfang ist die Hälfte des Ganzen.', author: 'Aristoteles' },
        { text: 'Es ist nicht wenig Zeit, die wir haben, sondern viel Zeit, die wir nicht nutzen.', author: 'Seneca' },
        { text: 'Jede Reise beginnt mit einem ersten Schritt.', author: 'Laozi' },
        { text: 'Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden.', author: 'Robert Collier' },
        { text: 'Die einzige Art Grossartiges zu leisten, ist zu lieben was man tut.', author: 'Steve Jobs' },
        { text: 'Tu heute etwas, worauf dein zukünftiges Ich stolz sein wird.', author: 'Unbekannt' },
        { text: 'Konzentration ist der Schlüssel zum Erfolg.', author: 'Bill Gates' },
        { text: 'Es ist immer zu früh, um aufzugeben.', author: 'Norman Vincent Peale' }
    ];

    getRandomQuote(): Observable<Quote> {
        // Using a CORS proxy for ZenQuotes API
        return this.http.get<any[]>('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
            .pipe(
                map(response => {
                    if (response && response[0]) {
                        return {
                            text: response[0].q,
                            author: response[0].a
                        };
                    }
                    return this.getRandomFallback();
                }),
                catchError(() => of(this.getRandomFallback()))
            );
    }

    private getRandomFallback(): Quote {
        const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
        return this.fallbackQuotes[randomIndex];
    }
}
