import { Component, Inject, OnInit } from '@angular/core'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { MatTable } from '@angular/material/table'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IsNumValidators } from '../isnum.validators'
import { ApiService } from '../api.service'

export interface DialogData {
    animal: string
    name: string
}

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent implements OnInit {
    constructor(
        private apiService: ApiService,
        private dialogRef: MatDialogRef<ModalFormComponent>
    ) {}

    form = new FormGroup({
        speciality_name: new FormControl('', Validators.required),
        speciality_code: new FormControl('', [
            Validators.required,
            Validators.maxLength(5),
            IsNumValidators.isNum,
        ]),
    })

    ngOnInit(): void {}
    addSpeciality(): any {
        if (!this.form.value.speciality_id) {
        }
        // if (this.form.valid) {
        //     this.apiService
        //         .addEntity('Speciality', this.form.value)
        //         .subscribe((response) => response)
        //     this.dialogRef.close()
        // }
    }
    onCancel() {
        this.dialogRef.close()
    }
    updSpeciality(elem) {}
}
