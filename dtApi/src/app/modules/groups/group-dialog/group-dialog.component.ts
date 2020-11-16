import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { GroupsService } from '../groups.service'

export interface DialogData {
    group_id: string
    group_name: string
    speciality_name: string
    faculty_name: string
    type: string
}

@Component({
    selector: 'app-group-dialog',
    templateUrl: './group-dialog.component.html',
    styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit {
    sharedInfo: any
    specialities: any
    faculties: any
    groupInfo: []
    title: string
    constructor(
        private groupsSertvice: GroupsService,
        public dialogRef: MatDialogRef<GroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        if (this.data.type === 'add') {
            this.title = 'Додати групу'
        } else {
            this.title = 'Редагувати групу'
        }
        this.sharedInfo = this.groupsSertvice.getsharedData()
        this.specialities = this.sharedInfo[0][0]
        this.faculties = this.sharedInfo[0][1]
        this.groupsSertvice
            .getData('Group', this.data.group_id)
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
