import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    dialogRef: MatDialogRef<ConfirmDialogComponent>
    constructor(private dialog: MatDialog) {}

    openConfirmDialog(data) {
        return (this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data,
            disableClose: true,
        }))
    }
}
