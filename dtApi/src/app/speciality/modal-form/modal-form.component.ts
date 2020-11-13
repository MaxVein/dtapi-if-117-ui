import { Component, Inject, OnInit } from '@angular/core'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IsNumValidators } from '../isnum.validators'
import { ApiService } from '../api.service'

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent implements OnInit {
    constructor(
        private apiService: ApiService,
        private dialogRef: MatDialogRef<ModalFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}

    form = new FormGroup({
        speciality_name: new FormControl(
            this.data ? this.data.speciality_name : '',
            Validators.required
        ),
        speciality_code: new FormControl(
            this.data ? this.data.speciality_code : '',
            [
                Validators.required,
                Validators.maxLength(5),
                IsNumValidators.isNum,
            ]
        ),
    })

    ngOnInit() {}
    addSpeciality() {
        if (this.form.valid && !this.data) {
            this.apiService.addEntity('Speciality', this.form.value).subscribe()
            this.dialogRef.close()
        } else if (this.form.valid && this.data) {
            this.apiService
                .updateEntity(
                    'Speciality',
                    this.data.speciality_id,
                    this.form.value
                )
                .subscribe((data) => {
                    this.dialogRef.close(this.form.value)
                    return data
                })
        }
    }
    onCancel() {
        this.dialogRef.close()
    }
}
