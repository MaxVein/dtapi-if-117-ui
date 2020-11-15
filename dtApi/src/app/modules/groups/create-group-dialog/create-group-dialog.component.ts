import { Component, Inject } from '@angular/core'
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'

import { GroupsService } from '../groups.service'

export interface DialogData {
    group_name: string
    speciality_name: string
    faculty_name: string
}

@Component({
    selector: 'app-create-group-dialog',
    templateUrl: './create-group-dialog.component.html',
    styleUrls: ['./create-group-dialog.component.scss'],
})
export class CreateGroupDialogComponent {
    sharedInfo: any
    specialities: any
    faculties: any
    constructor(
        private groupsSertvice: GroupsService,
        public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.sharedInfo = groupsSertvice.getsharedData()
        this.specialities = this.sharedInfo[0][0]
        this.faculties = this.sharedInfo[0][1]
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
