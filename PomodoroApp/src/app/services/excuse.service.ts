import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

/**
 * Interface für die Antwort der Excuser API
 */
export interface ExcuseResponse {
    id: number;
    excuse: string;
    category: string;
}

/**
 * Interface für die Antwort der MyMemory Translation API
 */
export interface TranslationResponse {
    responseData: {
        translatedText: string;
        match: number;
    };
    responseStatus: number;
}

/**
 * Interface für das verarbeitete Ergebnis
 */
export interface ExcuseResult {
    originalExcuse: string;
    translatedExcuse: string;
    mailtoLink: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExcuseService {
    private readonly http = inject(HttpClient);

    // API Endpoints - College Kategorie für Schul-Ausreden
    private readonly EXCUSE_API = 'https://excuser-three.vercel.app/v1/excuse/college';
    private readonly TRANSLATION_API = 'https://api.mymemory.translated.net/get';

    // Email Konfiguration
    private readonly TEACHER_EMAIL = 'lehrer@schule.ch';

    /**
     * Holt eine zufällige Ausrede, übersetzt sie ins Deutsche und erstellt einen mailto-Link.
     * Nutzt RxJS switchMap für eine saubere Chain.
     * @param recipientEmail - E-Mail-Adresse des Empfängers
     */
    getExcuseAndOpenMail(recipientEmail: string): Observable<ExcuseResult> {
        return this.fetchRandomExcuse().pipe(
            // switchMap: Wechselt zum inneren Observable (Übersetzung)
            switchMap((excuseData) => {
                const englishExcuse = excuseData.excuse;
                return this.translateToGerman(englishExcuse).pipe(
                    // Map das Ergebnis zum finalen ExcuseResult
                    map((translatedText) => this.createExcuseResult(englishExcuse, translatedText, recipientEmail))
                );
            }),
            // Globales Error-Handling für die gesamte Chain
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Holt eine zufällige englische Ausrede von der Excuser API.
     */
    private fetchRandomExcuse(): Observable<ExcuseResponse> {
        return this.http.get<ExcuseResponse[]>(this.EXCUSE_API).pipe(
            map((response) => {
                if (!response || response.length === 0) {
                    throw new Error('Keine Ausrede von der API erhalten');
                }
                return response[0];
            }),
            catchError((error) => {
                console.error('Fehler beim Laden der Ausrede:', error);
                return throwError(() => new Error('Die Ausreden-API ist nicht erreichbar. Bitte versuche es später erneut.'));
            })
        );
    }

    /**
     * Übersetzt den englischen Text ins Deutsche mittels MyMemory API.
     */
    private translateToGerman(text: string): Observable<string> {
        const encodedText = encodeURIComponent(text);
        const url = `${this.TRANSLATION_API}?q=${encodedText}&langpair=en|de`;

        return this.http.get<TranslationResponse>(url).pipe(
            map((response) => {
                if (response.responseStatus !== 200 || !response.responseData?.translatedText) {
                    throw new Error('Übersetzung fehlgeschlagen');
                }
                return response.responseData.translatedText;
            }),
            catchError((error) => {
                console.error('Fehler bei der Übersetzung:', error);
                return throwError(() => new Error('Die Übersetzungs-API ist nicht erreichbar. Bitte versuche es später erneut.'));
            })
        );
    }

    /**
     * Erstellt das Ergebnis-Objekt mit dem mailto-Link.
     * @param recipientEmail - E-Mail-Adresse des Empfängers
     */
    private createExcuseResult(original: string, translated: string, recipientEmail: string): ExcuseResult {
        const subject = encodeURIComponent(translated);
        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}`;

        return {
            originalExcuse: original,
            translatedExcuse: translated,
            mailtoLink
        };
    }

    /**
     * Öffnet den mailto-Link im Standard-Mail-Programm.
     */
    openMailClient(mailtoLink: string): void {
        window.location.href = mailtoLink;
    }

    /**
     * Zentrale Fehlerbehandlung für HTTP-Fehler.
     */
    private handleError(error: HttpErrorResponse | Error): Observable<never> {
        let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';

        if (error instanceof HttpErrorResponse) {
            // HTTP-Fehler (z.B. 404, 500)
            if (error.status === 0) {
                errorMessage = 'Keine Internetverbindung oder Server nicht erreichbar.';
            } else {
                errorMessage = `Server-Fehler: ${error.status} - ${error.statusText}`;
            }
        } else if (error instanceof Error) {
            // Allgemeine Fehler
            errorMessage = error.message;
        }

        console.error('ExcuseService Fehler:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
