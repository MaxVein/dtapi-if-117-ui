import { NgModule } from '@angular/core'
import { StudentsPageComponent } from './students-page/students-page.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/modules/shared.module'

import { StudentsModalComponent } from './students-page/students-modal/students-modal.component'
import { StudentsService } from '../shared/services/students/students.service';
import { StudentsViewModalComponent } from './students-page/students-view-modal/students-view-modal.component';
import { StudentsTransferModalComponent } from './students-page/students-transfer-modal/students-transfer-modal.component'

@NgModule({
    declarations: [StudentsPageComponent, StudentsModalComponent, StudentsViewModalComponent, StudentsTransferModalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'Students/:id',
                component: StudentsPageComponent,
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    providers: [StudentsService],
})
export class StudentsModule {}
