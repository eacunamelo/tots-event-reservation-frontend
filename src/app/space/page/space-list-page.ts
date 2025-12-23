import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpacesService } from '../services/space.service';
import { AuthService } from '../../auth/services/auth.service';
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

  searchParams = {
    type: '',
    capacity: '',
    date: ''
  };

  constructor(
    private spacesService: SpacesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpaces();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadSpaces(): void {
    this.spaces$ = this.spacesService.getSpaces();
  }

  searchSpaces(): void {
    const { type, capacity, date } = this.searchParams;
    this.spaces$ = this.spacesService.getSpaces(type, capacity, date);
  }

  viewSpaceDetails(spaceId: number): void {
    this.router.navigate(['/spaces', spaceId]);
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
