/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, NgForm } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalData } from '../../admin-model/Admins'
import { AdminsCrudService } from '../../admin-services/admins-crud.service'
import { AdminModalCreationComponent } from '../admin-modal-creation/admin-modal-creation.component'

@Component({
    selector: 'app-delete-confirm-modal',
    templateUrl: './delete-confirm-modal.component.html',
    styleUrls: ['./delete-confirm-modal.component.scss'],
})
export class DeleteConfirmModalComponent {
    constructor(
        public dialogRef: MatDialogRef<AdminModalCreationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
        private formBuilder: FormBuilder,
        private admincrud: AdminsCrudService
    ) {}

    submit(data: any, form: NgForm): void {
        if (form.submitted) {
            this.admincrud.deleteAdmin(data.user.id).subscribe((res) => {
                alert(JSON.stringify(res))
                if (res.response === 'ok') {
                    setTimeout(() => window.location.reload(), 1000)
                }
            })
        } else {
            this.onNoClick()
        }
    }
    onNoClick(): void {
        this.dialogRef.close()
    }
}
