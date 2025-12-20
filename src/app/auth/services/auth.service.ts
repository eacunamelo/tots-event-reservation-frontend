import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.post<{ access_token: string }>('/login', {
      email,
      password
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token');
  }
}
