import { Component, OnInit, Inject } from '@angular/core'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'

export interface DialogData {
    group_name: string
}

@Component({
    selector: 'app-create-group-dialog',
    templateUrl: './create-group-dialog.component.html',
    styleUrls: ['./create-group-dialog.component.scss'],
})
export class CreateGroupDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onNoClick(): void {
        this.dialogRef.close()
    }
}
