import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { config } from 'process'
import { Observable } from 'rxjs'

import { ApiService } from '../api.service'
import { DialogService } from '../dialog.service'

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}

    agreeBtn(): void {
        this.apiService
            .delEntity('Speciality', this.data.speciality_id)
            .subscribe(
                (res) => {
                    if (res.response === 'ok')
                        this.dialogRef.close(res.response)
                },
                (error) => {
                    this.apiService.snackBarOpen()
                }
            )
    }
}
