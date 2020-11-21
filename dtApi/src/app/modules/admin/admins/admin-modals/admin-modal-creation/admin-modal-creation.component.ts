import { Component, Inject } from '@angular/core'
import { AdminsCreation } from '../../admin-model/Admins'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
    selector: 'app-admin-modal-creation',
    templateUrl: './admin-modal-creation.component.html',
    styleUrls: ['./admin-modal-creation.component.scss'],
})
export class AdminModalCreationComponent {
    constructor(
        public dialogRef: MatDialogRef<AdminModalCreationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AdminsCreation
    ) {}

    onNoClick(): void {
        this.dialogRef.close()
    }
}
