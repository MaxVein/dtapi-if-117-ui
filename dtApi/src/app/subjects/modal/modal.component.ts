import { Component, OnInit, Inject } from '@angular/core'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { FormControl, FormGroup, Validators } from '@angular/forms'

interface Subjects {
    subject_name: string
    subject_description: string
}

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    public subjectForm = new FormGroup({
        subject_name: new FormControl(this.data ? this.data.subject_name : '', [
            Validators.required,
            Validators.pattern('[а-яА-ЯіІїЄє ]*'),
        ]),
        subject_description: new FormControl(
            this.data ? this.data.subject_description : '',
            [Validators.required, Validators.pattern('[а-яА-ЯіІїЄє ]*')]
        ),
    })

    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Subjects
    ) {}

    ngOnInit(): void {}

    onNoClick(): void {
        this.dialogRef.close()
    }

    save() {
        if (this.subjectForm.invalid) {
            return true
        }
        this.dialogRef.close(this.subjectForm.value)
    }

    hasError = (controlName: string, errorName: string) => {
        return this.subjectForm.controls[controlName].hasError(errorName)
    }
}
