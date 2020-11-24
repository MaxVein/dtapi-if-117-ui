/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Inject, Input, OnInit } from '@angular/core'
import { Admins, ModalData } from '../../admin-model/Admins'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MustMatch } from '../../validators/password-match.validator'
import { AdminsCrudService } from '../../admin-services/admins-crud.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'

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
        private admincrud: AdminsCrudService,
        private snackBar: MatSnackBar
    ) {}

    hide = true
    AdminForm: FormGroup
    formForUpdateCondition: boolean = this.data.title !== 'Редагувати адміна'

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
        )
    }
    get adminControls() {
        return this.AdminForm.controls
    }
    deleteUpdateFormNameValidation() {
        this.AdminForm.get('username').clearValidators()
        this.AdminForm.get('username').updateValueAndValidity()
    }
    submit(data: any): void {
        if (this.AdminForm.valid) {
            const formValue = this.AdminForm.value
            switch (data.title) {
                case 'Додати адміна':
                    if (formValue) {
                        this.admincrud.addAdmin(formValue).subscribe(
                            (res) => {
                                console.warn('Результат запиту', res)
                                if (res !== {}) {
                                    Object.assign(data.user, res)
                                    this.snackBar.open(
                                        'Адміна успішно додано',
                                        'Закрити',
                                        {
                                            duration: 3000,
                                        }
                                    )
                                    this.dialogRef.close()
                                } else {
                                    data.user = undefined
                                    this.dialogRef.close()
                                }
                            },
                            (err) => {
                                data.user = undefined
                                this.snackBar.open(
                                    'Адмін з такими даними існує',
                                    'Закрити',
                                    {
                                        duration: 3000,
                                    }
                                )
                                this.dialogRef.close()
                            }
                        )
                    }
                    break
                case 'Редагувати адміна':
                    if (formValue) {
                        for (const item in formValue) {
                            if (formValue[item] === null) {
                                delete formValue[item]
                            }
                        }
                        const changedValues = formValue
                        const changedValuesJSON = JSON.stringify(formValue)
                        if (changedValuesJSON !== '{}') {
                            if (this.AdminForm.get('username')) {
                                this.admincrud
                                    .checkAdminName(
                                        this.AdminForm.get('username').value
                                    )
                                    .subscribe((res) => {
                                        if (res.response === true) {
                                            this.snackBar.open(
                                                "Таке ім'я вже існує",
                                                'Закрити',
                                                {
                                                    duration: 3000,
                                                }
                                            )
                                        } else if (res.response === false) {
                                            this.admincrud
                                                .updateAdmin(
                                                    changedValuesJSON,
                                                    data.user.id
                                                )
                                                .subscribe(
                                                    (res) => {
                                                        if (
                                                            res.response ===
                                                            'ok'
                                                        ) {
                                                            this.dialogRef.close()
                                                            data.newUser = changedValues
                                                            this.snackBar.open(
                                                                'Адміна успішно відредаговано',
                                                                'Закрити',
                                                                {
                                                                    duration: 3000,
                                                                }
                                                            )
                                                        }
                                                    },
                                                    (err) => {
                                                        this.snackBar.open(
                                                            `${JSON.stringify(
                                                                err
                                                            )}`,
                                                            'Закрити',
                                                            {
                                                                duration: 3000,
                                                            }
                                                        )
                                                    }
                                                )
                                        }
                                    })
                            } else {
                                this.admincrud
                                    .updateAdmin(
                                        changedValuesJSON,
                                        data.user.id
                                    )
                                    .subscribe((res) => {
                                        if (res.response === 'ok') {
                                            this.dialogRef.close()
                                            data.newUser = changedValues
                                            this.snackBar.open(
                                                'Адміна успішно відредаговано',
                                                'Закрити',
                                                {
                                                    duration: 3000,
                                                }
                                            )
                                        }
                                    })
                            }
                        } else {
                            this.snackBar.open('Веддіть значення', 'Закрити', {
                                duration: 3000,
                            })
                        }
                    }
            }
        }
    }
    onNoClick(): void {
        this.dialogRef.close()
    }
}
