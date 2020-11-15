import { NgModule } from '@angular/core'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDividerModule } from '@angular/material/divider'

@NgModule({
    imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
    ],
    exports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
    ],
})
export class AngularMaterialModule {}
