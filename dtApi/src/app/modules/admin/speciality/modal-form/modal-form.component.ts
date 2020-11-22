import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { IsNumValidators } from '../isnum.validators'
import { ApiService } from '../../../../shared/services/api.service'

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private dialogRef: MatDialogRef<ModalFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}

    form: FormGroup

    ngOnInit() {
        this.form = this.formBuilder.group({
            speciality_name: [
                this.data ? this.data.speciality_name : '',
                [Validators.required],
            ],
            speciality_code: [
                this.data ? this.data.speciality_code : '',
                [
                    Validators.required,
                    Validators.maxLength(5),
                    Validators.pattern('^[0-9]*$'),
                ],
            ],
        })
    }
    addSpeciality(str: string): void {
        switch (str) {
            case 'update':
                this.apiService
                    .updateEntity(
                        'Speciality',
                        this.data.speciality_id,
                        this.form.value
                    )
                    .subscribe(
                        (res) => {
                            this.dialogRef.close(res)
                        },
                        (error) => {
                            this.apiService.snackBarOpen()
                        }
                    )
                break
            case 'add':
                this.apiService
                    .addEntity('Speciality', this.form.value)
                    .subscribe(
                        (res) => this.dialogRef.close(res),
                        (error) => {
                            this.apiService.snackBarOpen()
                        }
                    )
        }
    }
    onCancel(): void {
        this.dialogRef.close()
    }
}
