import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError, map, startWith } from 'rxjs/operators';

import { SpacesService } from '../../services/space.service';
import { Space } from '../../models/space.model';
import { NotificationService } from '../../../core/services/notification.service';

type Vm = { loading: boolean; space: Space | null };

@Component({
  standalone: true,
  selector: 'app-space-form-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './space-form-page.html',
  styleUrls: ['./space-form-page.css']
})
export class SpaceFormPage implements OnInit {

  spaceForm!: FormGroup;

  vm$!: Observable<Vm>;

  spaceId: number | null = null;
  isEditMode = false;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spacesService: SpacesService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.spaceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });

    this.vm$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');

        if (!id) {
          this.isEditMode = false;
          this.spaceId = null;

          this.spaceForm.reset({ name: '', description: '', capacity: '' });
          this.selectedFile = null;
          this.imagePreview = null;

          return of({ loading: false, space: null } as Vm);
        }

        this.isEditMode = true;
        this.spaceId = +id;

        return this.spacesService.getSpaceById(this.spaceId).pipe(
          tap(space => {
            this.spaceForm.patchValue({
              name: space.name,
              description: space.description,
              capacity: space.capacity
            });
            this.imagePreview = space.image_url;
          }),
          map(space => ({ loading: false, space } as Vm)),
          catchError(() => {
            this.notification.showError('No se pudo cargar el espacio');
            return of({ loading: false, space: null } as Vm);
          }),
          startWith({ loading: true, space: null } as Vm)
        );
      })
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  submit(): void {
    if (this.spaceForm.invalid) {
      this.spaceForm.markAllAsTouched();
      this.notification.showWarn('Completa todos los campos obligatorios');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.spaceForm.value.name);
    formData.append('description', this.spaceForm.value.description);
    formData.append('capacity', this.spaceForm.value.capacity.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.isEditMode && this.spaceId
      ? this.spacesService.updateSpace(this.spaceId, formData)
      : this.spacesService.createSpace(formData);

    request$.subscribe({
      next: () => {
        this.notification.showSuccess(
          this.isEditMode
            ? 'Espacio actualizado correctamente'
            : 'Espacio creado correctamente'
        );
        this.router.navigate(['/spaces']);
      },
      error: () => {
        this.notification.showError('Error al guardar el espacio');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
