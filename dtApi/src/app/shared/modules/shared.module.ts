import { NgModule } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmComponent } from '../components/confirm/confirm.component';
import { AlertComponent } from '../components/alert/alert.component';

import { ModalService } from '../services/modal.service';

@NgModule({
    declarations: [LoaderComponent, ConfirmComponent, AlertComponent],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        AngularMaterialModule,
        LoaderComponent,
        ConfirmComponent,
        AlertComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [ModalService],
})
export class SharedModule {}
