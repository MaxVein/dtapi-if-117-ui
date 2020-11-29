import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(public dialog: MatDialog) {}

    openAlertModal(msg: string, title: string): void {
        const dialogRef = this.dialog.open(AlertComponent, {
            data: {
                message: msg,
                title: title,
            },
        });
    }

    openConfirmModal(msg: string, callbackFunction: () => void): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: msg,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) callbackFunction();
        });
    }

    openErrorModal(msg: string): void {
        this.openAlertModal(msg, 'Помилка');
    }
}
