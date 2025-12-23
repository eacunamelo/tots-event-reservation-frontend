import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ToolbarModule,
    ButtonModule
  ],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.authSub = this.authService.authenticated$().subscribe(
    (status: boolean) => {
      this.isAuthenticated = status;
    }
  );
}


  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.clearSession();
    this.router.navigate(['/auth/login']);
  }

  goToSpaces(): void {
    this.router.navigate(['/spaces']);
  }

  goToReservations(): void {
    this.router.navigate(['/reservations']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
  this.router.navigate(['/auth/register']);
}
}
