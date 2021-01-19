import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    group_id: string;
    subject_id: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    groups;
}

@Component({
    selector: 'app-timetable-dialog',
    templateUrl: './timetable-dialog.component.html',
    styleUrls: ['./timetable-dialog.component.scss'],
})
export class TimetableDialogComponent implements OnInit {
    form: FormGroup;
    groups;
    currDate: Date;
    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<TimetableDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        this.groups = this.data.groups;
        this.currDate = new Date();
        this.form = this.formBuilder.group({
            group_id: [
                this.data.group_id ? this.data.group_id : '',
                [Validators.required],
            ],
            start_date: [
                this.data.start_date ? this.data.start_date : '',
                [Validators.required],
            ],
            start_time: [
                this.data.start_time ? this.data.start_time : '',
                [Validators.required],
            ],
            end_date: [
                this.data.end_date ? this.data.end_date : '',
                [Validators.required],
            ],
            end_time: [
                this.data.end_time ? this.data.end_time : '',
                [Validators.required],
            ],
        });
    }

    sendTimetable() {
        this.dialogRef.close(this.form.value);
    }
}
