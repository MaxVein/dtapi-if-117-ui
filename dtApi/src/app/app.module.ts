import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ListTableComponent } from './speciality/list-table/list-table.component'
import { ModalFormComponent } from './speciality/modal-form/modal-form.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'

@NgModule({
    declarations: [AppComponent, ListTableComponent, ModalFormComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
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
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
