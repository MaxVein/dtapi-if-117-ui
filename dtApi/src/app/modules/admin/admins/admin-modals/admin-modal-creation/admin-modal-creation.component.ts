/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Inject, OnInit } from '@angular/core'
import { ModalData } from '../../admin-model/Admins'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MustMatch } from '../../validators/password-match.validator'
import { AdminsCrudService } from '../../admin-services/admins-crud.service'

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
        private admincrud: AdminsCrudService
    ) {}

    hide = true
    AdminForm: FormGroup
    formForUpdateCondition: boolean = this.data.title !== 'Редагувати адміна'

    ngOnInit(): void {
        this.AdminForm = this.formBuilder.group(
            {
                username: new FormControl(null, Validators.required),
                email: new FormControl(null, Validators.email),
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
                        this.admincrud.addAdmin(formValue).subscribe((res) => {
                            if (res) {
                                window.location.reload()
                            }
                        })
                    }
                    break
                case 'Редагувати адміна':
                    if (formValue) {
                        for (const item in formValue) {
                            if (formValue[item] === null) {
                                delete formValue[item]
                            }
                        }
                        const changedValues = JSON.stringify(formValue)
                        if (changedValues !== '{}') {
                            if (this.AdminForm.get('username')) {
                                this.admincrud
                                    .checkAdminName(
                                        this.AdminForm.get('username').value
                                    )
                                    .subscribe((res) => {
                                        if (res.response === true) {
                                            alert("Таке ім'я вже існує")
                                        } else if (res.response === false) {
                                            this.admincrud
                                                .updateAdmin(
                                                    changedValues,
                                                    data.user.id
                                                )
                                                .subscribe((res) => {
                                                    if (res.response === 'ok') {
                                                        console.warn(res)
                                                        // window.location.reload()
                                                    }
                                                })
                                        }
                                    })
                            } else {
                                this.admincrud
                                    .updateAdmin(changedValues, data.user.id)
                                    .subscribe((res) => {
                                        if (res.response === 'ok') {
                                            console.warn(res)
                                            // window.location.reload()
                                        }
                                    })
                            }
                        } else {
                            alert('Введіть значення')
                        }
                    }
            }
        }
    }
    onNoClick(): void {
        this.dialogRef.close()
    }
}
