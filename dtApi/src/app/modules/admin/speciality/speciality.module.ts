import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'

import { MatTableModule } from '@angular/material/table'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'
import { ModalFormComponent } from './modal-form/modal-form.component'
import { ListTableComponent } from './list-table/list-table.component'

@NgModule({
    declarations: [
        ListTableComponent,
        ModalFormComponent,
        ConfirmDialogComponent,
    ],
    exports: [ListTableComponent, ModalFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientModule,
        MatTableModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        MatDialogModule,
        BrowserAnimationsModule,
    ],
})
export class SpecialityModule {}
