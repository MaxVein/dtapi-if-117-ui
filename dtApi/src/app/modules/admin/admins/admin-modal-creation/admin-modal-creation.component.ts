/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalData } from '../Admins';
import { MustMatch } from '../validators/password-match.validator';
import { AdminsCrudService } from '../admins.service';
import { pluck, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-admin-modal-creation',
    templateUrl: './admin-modal-creation.component.html',
    styleUrls: ['./admin-modal-creation.component.scss'],
})
export class AdminModalCreationComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AdminModalCreationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
        private formBuilder: FormBuilder,
        private adminservice: AdminsCrudService,
        private snackBar: MatSnackBar
    ) {}
    hide = true;
    AdminForm: FormGroup;
    formForUpdateCondition: boolean = this.data.title !== 'Редагувати адміна';

    ngOnInit(): void {
        this.AdminForm = this.formBuilder.group(
            {
                username: new FormControl(
                    this.data.user ? this.data.user.username : null,
                    Validators.required
                ),
                email: new FormControl(
                    this.data.user ? this.data.user.email : null,
                    Validators.email
                ),
                password: new FormControl(
                    null,
                    Validators.pattern(
                        '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'
                    )
                ),
                password_confirm: new FormControl(null),
            },
            {
                validator: MustMatch('password', 'password_confirm'),
            }
        );
    }
    get adminControls() {
        return this.AdminForm.controls;
    }
    deleteUpdateFormNameValidation() {
        this.AdminForm.get('username').clearValidators();
        this.AdminForm.get('username').updateValueAndValidity();
    }
    addAdmin(formValues): void {
        const snackbar = this.snackBar;
        this.adminservice.addAdmin(formValues).subscribe(
            (newUser) => {
                snackbar.open('Адміна успішно додано', 'Закрити', {
                    duration: 3000,
                });
                this.dialogRef.close({
                    finished: true,
                    user: newUser,
                });
            },
            (err) => {
                snackbar.open('Адмін з такими даними існує', 'Закрити', {
                    duration: 3000,
                });
            }
        );
    }
    updateAdmin(formValues, data): void {
        const snackbar = this.snackBar;
        this.adminservice
            .checkAdminName(this.AdminForm.get('username').value)
            .pipe(
                pluck('response'),
                switchMap((response: boolean) => {
                    if (response) {
                        snackbar.open("Таке ім'я вже існує", 'Закрити', {
                            duration: 3000,
                        });
                        return of(response);
                    } else {
                        return this.adminservice
                            .updateAdmin(
                                JSON.stringify(formValues),
                                data.user.id
                            )
                            .pipe(pluck('response'));
                    }
                })
            )
            .subscribe(
                (res) => {
                    snackbar.open('Адміна успішно відредаговано', 'Закрити', {
                        duration: 3000,
                    });
                    this.dialogRef.close({
                        finished: true,
                        user: {
                            id: data.user.id,
                            ...formValues,
                        },
                    });
                },
                (err) => {
                    snackbar.open('Щось пішло не так', 'Закрити', {
                        duration: 3000,
                    });
                }
            );
    }
    submit(data: any): void {
        if (this.AdminForm.valid) {
            switch (data.title) {
                case 'Додати адміна':
                    this.addAdmin(this.AdminForm.value);
                    break;
                case 'Редагувати адміна':
                    this.updateAdmin(this.AdminForm.value, data);
                    break;
            }
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
