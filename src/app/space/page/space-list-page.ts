import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, finalize, debounceTime, map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SpacesService } from '../services/space.service';
import { AuthService } from '../../auth/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonModule } from 'primeng/button';
import { Space } from '../models/space.model';

@Component({
  standalone: true,
  selector: 'app-spaces-list-page',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './space-list-page.html',
  styleUrls: ['./space-list-page.css']
})
export class SpacesListPage implements OnInit {

  spaces$!: Observable<Space[]>;
  filteredSpaces$!: Observable<Space[]>;

  isLoading = false;

  filterForm!: FormGroup;

  constructor(
    private spacesService: SpacesService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFilters();
    this.loadSpaces();
    this.setupFiltering();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadSpaces(): void {
    this.isLoading = true;

    this.spaces$ = this.spacesService.getSpaces().pipe(
      catchError(() => {
        this.notification.showError('No se pudieron cargar los espacios');
        return of([] as Space[]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  initFilters(): void {
    this.filterForm = this.fb.group({
      search: [''],
      minCapacity: ['']
    });
  }

  setupFiltering(): void {
    const search$ = this.filterForm.get('search')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300)
    );

    const minCapacity$ = this.filterForm.get('minCapacity')!.valueChanges.pipe(
      startWith('')
    );

    this.filteredSpaces$ = combineLatest([
      this.spaces$,
      search$,
      minCapacity$
    ]).pipe(
      map(([spaces, search, minCapacity]) => {
        return spaces.filter(space => {
          const matchesText =
            !search ||
            space.name.toLowerCase().includes(search.toLowerCase()) ||
            space.description.toLowerCase().includes(search.toLowerCase());

          const matchesCapacity =
            !minCapacity || space.capacity >= Number(minCapacity);

          return matchesText && matchesCapacity;
        });
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
