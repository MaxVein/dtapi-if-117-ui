import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ModalFormComponent } from './modal-form/modal-form.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    dialogRef: MatDialogRef<ConfirmDialogComponent>;
    modalDialogRef: MatDialogRef<ModalFormComponent>;
    constructor(private dialog: MatDialog) {}

    openConfirmDialog(data): any {
        return (this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data,
            disableClose: true,
        }));
    }

    createModal(data?): any {
        return (this.modalDialogRef = this.dialog.open(ModalFormComponent, {
            data: data ? data : '',
            autoFocus: true,
            disableClose: true,
        }));
    }
}
