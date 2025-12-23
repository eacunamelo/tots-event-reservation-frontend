import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private authenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, credentials).pipe(
      tap(res => this.saveToken(res.access_token)),
      tap(() => this.loadUser().subscribe())
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  loadUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}me`).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.authenticatedSubject.next(true);
      })
    );
  }

  getUser(): any {
    return this.getStoredUser();
  }

  getRole(): string | null {
    return this.getStoredUser()?.role || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  authenticated$(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  private getStoredUser(): any {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }
}
