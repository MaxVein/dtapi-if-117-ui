import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AdminModalCreationComponent } from './admin-modal-creation/admin-modal-creation.component';
import { DeleteConfirmModalComponent } from './delete-confirm-modal/delete-confirm-modal.component';

const routes: Routes = [{ path: '', component: AdminsComponent }];

@NgModule({
    declarations: [
        AdminsComponent,
        AdminModalCreationComponent,
        DeleteConfirmModalComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [AdminsComponent],
})
export class AdminsModule {}
