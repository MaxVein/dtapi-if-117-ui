import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface SubjectsResponse {
    subject_id: number;
    subject_name: string;
    subject_description: string;
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
        ]),
        subject_description: new FormControl(
            this.data ? this.data.subject_description : '',
            [Validators.required]
        ),
        subject_id: new FormControl(this.data ? this.data.subject_id : ''),
    });

    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SubjectsResponse
    ) {}

    ngOnInit(): void {}

    public onSubmit() {
        if (
            this.subjectForm.valid &&
            this.subjectForm.touched &&
            this.subjectForm.dirty
        ) {
            this.dialogRef.close(this.subjectForm.value);
        }
    }

    public onClose(): void {
        this.dialogRef.close(false);
    }

    hasError = (controlName: string, errorName: string) => {
        return this.subjectForm.controls[controlName].hasError(errorName);
    };
}
