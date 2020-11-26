import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FacultiesListComponent } from './faculties-list/faculties-list.component';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const routes: Routes = [{ path: '', component: FacultiesListComponent }];

@NgModule({
    declarations: [
        FacultiesListComponent,
        ModalFormComponent,
        ConfirmDialogComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [FacultiesListComponent],
})
export class FacultiesModule {}
