import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { GroupsComponent } from './groups.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';

const routes: Routes = [{ path: '', component: GroupsComponent }];

@NgModule({
    declarations: [
        GroupsComponent,
        ConfirmDeleteComponent,
        GroupDialogComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class GroupsModule {}
