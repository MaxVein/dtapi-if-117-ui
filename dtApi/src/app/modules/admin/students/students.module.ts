import { NgModule } from '@angular/core';
import { StudentsPageComponent } from './students-page/students-page.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { StudentsModalComponent } from './students-page/students-modal/students-modal.component';
import { StudentsViewModalComponent } from './students-page/students-view-modal/students-view-modal.component';
import { StudentsTransferModalComponent } from './students-page/students-transfer-modal/students-transfer-modal.component';

import { StudentsService } from 'src/app/modules/admin/students/students.service';

import { ConfirmDirective } from '../../../shared/directives/students/confirm.directive';

@NgModule({
    declarations: [
        StudentsPageComponent,
        StudentsModalComponent,
        StudentsViewModalComponent,
        StudentsTransferModalComponent,
        ConfirmDirective,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: StudentsPageComponent }]),
    ],
    providers: [StudentsService],
})
export class StudentsModule {}
