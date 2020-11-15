import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GroupsService } from '../groups.service'

export interface DialogData {
    group_id: string
    group_name: string
    speciality_name: string
    faculty_name: string
}

@Component({
    selector: 'app-edit-group-dialog',
    templateUrl: './edit-group-dialog.component.html',
    styleUrls: ['./edit-group-dialog.component.scss'],
})

export class EditGroupDialogComponent {
    sharedInfo: any
    specialities: any
    faculties: any
    groupInfo: []
    constructor(
        private groupsSertvice: GroupsService,
        public dialogRef: MatDialogRef<EditGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.sharedInfo = groupsSertvice.getsharedData()
        this.specialities = this.sharedInfo[0][0]
        this.faculties = this.sharedInfo[0][1]
    }

    ngOnInit() {
        console.log(this.data.group_id)
        this.groupsSertvice.getData('Group', this.data.group_id).subscribe(result =>
            console.log(result))
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}
