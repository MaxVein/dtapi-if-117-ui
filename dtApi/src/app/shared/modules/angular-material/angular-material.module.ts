import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDividerModule } from '@angular/material/divider'
import { MatSelectModule } from '@angular/material/select'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
    declarations: [],
    imports: [
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
        MatSelectModule,
    ],
    exports: [
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatTableModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatDividerModule,
        MatSelectModule,
    ],
})
export class AngularMaterialModule {}
