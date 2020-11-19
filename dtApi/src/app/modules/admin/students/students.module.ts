import { NgModule } from '@angular/core'
import { StudentsPageComponent } from './students-page/students-page.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { StudentsModalComponent } from './students-page/students-modal/students-modal.component'
import { StudentsViewModalComponent } from './students-page/students-view-modal/students-view-modal.component'
import { StudentsTransferModalComponent } from './students-page/students-transfer-modal/students-transfer-modal.component'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { SharedModule } from 'src/app/shared/modules/shared.module'

@NgModule({
    declarations: [
        StudentsPageComponent,
        StudentsModalComponent,
        StudentsViewModalComponent,
        StudentsTransferModalComponent,
    ],
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
