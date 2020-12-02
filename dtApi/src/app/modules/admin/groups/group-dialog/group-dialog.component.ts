import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GroupsService } from '../groups.service';

export interface DialogData {
    group_id: string;
    group_name: string;
    speciality_name: string;
    faculty_name: string;
    type: string;
}

@Component({
    selector: 'app-group-dialog',
    templateUrl: './group-dialog.component.html',
    styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit {
    sharedInfo: any = [];
    specialities: [];
    faculties: [];
    groupInfo: [];
    title: string;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private groupsSertvice: GroupsService,
        public dialogRef: MatDialogRef<GroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        if (this.data.type === 'add') {
            this.title = 'Додати групу';
        } else {
            this.title = 'Редагувати групу';
        }
        this.sharedInfo = this.groupsSertvice.getsharedData();
        this.specialities = this.sharedInfo[0][0];
        this.faculties = this.sharedInfo[0][1];
        this.groupsSertvice.getData('Group', this.data.group_id);
        this.form = this.formBuilder.group({
            group_name: [
                this.data ? this.data.group_name : '',
                [
                    Validators.required,
                    Validators.pattern(
                        '[А-Я\u0406]{1,4}[мз]?-[0-9]{2}-[0-9]{1}[к]?'
                    ),
                ],
            ],
            speciality_name: [
                this.data ? this.data.speciality_name : '',
                [Validators.required],
            ],
            faculty_name: [
                this.data ? this.data.faculty_name : '',
                [Validators.required],
            ],
        });
    }
    addGroup() {
        this.dialogRef.close(this.form.value);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
