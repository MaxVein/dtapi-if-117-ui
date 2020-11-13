import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ApiService } from '../api.service'
import { ModalFormComponent } from '../modal-form/modal-form.component'

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}

    ngOnInit(): void {}
    agreeBtn() {
        this.apiService
            .delEntity('Speciality', this.data.speciality_id)
            .subscribe((res) => {
                if (res.response === 'ok') this.dialogRef.close(res.response)
            })
    }
}
