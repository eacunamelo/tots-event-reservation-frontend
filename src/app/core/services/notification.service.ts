import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) {}

  showSuccess(message: string, summary: string = 'Éxito'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000
    });
  }

  showError(message: string, summary: string = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: message,
      life: 3000
    });
  }

  showInfo(message: string, summary: string = 'Info'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000
    });
  }

  showWarn(message: string, summary: string = 'Advertencia'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 3000
    });
  }
}
