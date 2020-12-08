import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    level: string;
    tasks: string;
    rate: string;
    levels: Array<number>;
}
@Component({
    selector: 'app-test-details-dialog',
    templateUrl: './test-details-dialog.component.html',
    styleUrls: ['./test-details-dialog.component.scss'],
})
export class TestDetailsDialogComponent implements OnInit {
    form: FormGroup;
    newLevels: Array<any> = [];
    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<TestDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        if (this.data.level) {
            this.newLevels.push(this.data.level);
        }
        for (let i = 1; i <= 20; i++) {
            if (!this.data.levels.includes(i)) {
                this.newLevels.push(i);
            }
        }

        this.form = this.formBuilder.group({
            level: [
                this.data.level ? this.data.level : '',
                [Validators.required],
            ],
            tasks: [
                this.data.tasks ? this.data.tasks : '',
                [Validators.required],
            ],
            rate: [this.data.rate ? this.data.rate : '', [Validators.required]],
        });
    }
    sendTest() {
        this.dialogRef.close(this.form.value);
    }
}
