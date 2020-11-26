import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ModalService {
    constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

    openModal(
        ModalComponent: ComponentType<any>,
        config: MatDialogConfig,
        callback?: (result) => void
    ): void {
        const modal = this.dialog.open(ModalComponent, config);

        if (callback) {
            modal.afterClosed().subscribe((result) => callback(result));
        }
    }

    showSnackBar(message: string): void {
        this.snackBar.open(message, '', {
            duration: 3000,
        });
    }
}
