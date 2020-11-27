import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiService } from '../../../../shared/services/api.service';

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

    form: FormGroup;

    ngOnInit() {
        this.form = this.formBuilder.group({
            faculty_name: [
                this.data ? this.data.faculty_name : '',
                [Validators.required],
            ],
            faculty_description: [
                this.data ? this.data.faculty_description : '',
                [Validators.required],
            ],
        });
    }
    addFaculty(str: string): void {
        switch (str) {
            case 'update':
                this.apiService
                    .updateEntity(
                        'Faculty',
                        this.data.faculty_id,
                        this.form.value
                    )
                    .subscribe(
                        (res) => {
                            this.dialogRef.close(res);
                        },
                        (error) => {
                            this.apiService.snackBarOpen();
                        }
                    );
                break;
            case 'add':
                this.apiService.addEntity('Faculty', this.form.value).subscribe(
                    (res) => this.dialogRef.close(res),
                    (error) => {
                        this.apiService.snackBarOpen();
                    }
                );
        }
    }
    onCancel(): void {
        this.dialogRef.close();
    }
}
