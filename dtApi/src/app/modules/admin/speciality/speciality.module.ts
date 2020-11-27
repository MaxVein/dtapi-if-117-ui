import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { ListTableComponent } from './list-table/list-table.component';
import { SharedModule } from '../../../shared/modules/shared.module';

const routes: Routes = [{ path: '', component: ListTableComponent }];

@NgModule({
    declarations: [
        ListTableComponent,
        ModalFormComponent,
        ConfirmDialogComponent,
    ],
    exports: [ListTableComponent, ModalFormComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class SpecialityModule {}
