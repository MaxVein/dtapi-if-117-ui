import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AdminsTemplateComponent } from './admins-template/admins-template.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AdminModalCreationComponent } from './admin-modals/admin-modal-creation/admin-modal-creation.component';
import { DeleteConfirmModalComponent } from './admin-modals/delete-confirm-modal/delete-confirm-modal.component';

const routes: Routes = [{ path: '', component: AdminsTemplateComponent }];

@NgModule({
    declarations: [
        AdminsTemplateComponent,
        AdminModalCreationComponent,
        DeleteConfirmModalComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [AdminsTemplateComponent],
})
export class AdminsModule {}
