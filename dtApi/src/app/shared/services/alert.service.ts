import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import { AlertComponent } from '../components/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    constructor(
        private modalService: ModalService,
        private snackBar: MatSnackBar
    ) {}

    message(message: string): void {
        this.snackBar.open(message, 'x', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['message-snackbar'],
        });
    }

    warning(message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title: 'Попередження',
                icon: 'warning',
            },
        });
    }

    error(message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title: 'Помилка',
                icon: 'error',
            },
        });
    }
}
