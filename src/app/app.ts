import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.hasToken()) {
      this.authService.loadUser().subscribe({
        error: () => this.authService.clearSession()
      });
    }
  }
}
