import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ListTableComponent } from './list-table/list-table.component'
import { ModalFormComponent } from './modal-form/modal-form.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'

@NgModule({
    declarations: [ListTableComponent, ModalFormComponent, ConfirmDialogComponent],
    exports: [ListTableComponent, ModalFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTableModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        MatDialogModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            { path: 'speciality', component: ListTableComponent },
        ]),
    ],
})
export class SpecialityModule {}
