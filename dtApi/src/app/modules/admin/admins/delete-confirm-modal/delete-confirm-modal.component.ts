/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pluck } from 'rxjs/operators';
import { AdminModalCreationComponent } from '../admin-modal-creation/admin-modal-creation.component';
import { ModalData } from '../Admins';
import { AdminsCrudService } from '../admins.service';

@Component({
    selector: 'app-delete-confirm-modal',
    templateUrl: './delete-confirm-modal.component.html',
    styleUrls: ['./delete-confirm-modal.component.scss'],
})
export class DeleteConfirmModalComponent {
    constructor(
        public dialogRef: MatDialogRef<AdminModalCreationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
        private admincrud: AdminsCrudService,
        private snackBar: MatSnackBar
    ) {}

    submit(data: any, form: NgForm): void {
        if (form.submitted) {
            this.admincrud
                .deleteAdmin(data.user.id)
                .pipe(pluck('response'))
                .subscribe((res) => {
                    if (res === 'ok') {
                        this.snackBar.open(
                            'Адміна успішно видалено',
                            'Закрити',
                            {
                                duration: 3000,
                            }
                        );
                        this.dialogRef.close({
                            finished: true,
                            user: data.user,
                        });
                    }
                });
        } else {
            this.dialogRef.close({
                finished: false,
                user: data.user,
            });
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
