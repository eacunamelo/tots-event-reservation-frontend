import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { SpacesService } from '../services/space.service';
import { AuthService } from '../../auth/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonModule } from 'primeng/button';
import { Space } from '../models/space.model';

@Component({
  standalone: true,
  selector: 'app-spaces-list-page',
  imports: [CommonModule, ButtonModule],
  templateUrl: './space-list-page.html',
  styleUrls: ['./space-list-page.css']
})
export class SpacesListPage implements OnInit {

  spaces$!: Observable<Space[]>;

  isLoading = false;

  constructor(
    private spacesService: SpacesService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpaces();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadSpaces(): void {
    this.isLoading = true;

    this.spaces$ = this.spacesService.getSpaces().pipe(
      catchError(() => {
        this.notification.showError(
          'No se pudieron cargar los espacios'
        );
        return of([] as Space[]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  goToReservationForm(spaceId: number): void {
    this.router.navigate(['/reservations/new', spaceId]);
  }

  goToEditSpace(spaceId: number): void {
    this.router.navigate(['/spaces/edit', spaceId]);
  }

  goToCreateSpace(): void {
    this.router.navigate(['/spaces/new']);
  }

  trackById(index: number, space: Space): number {
    return space.id;
  }
}
