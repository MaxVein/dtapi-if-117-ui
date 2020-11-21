import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { SharedModule } from 'src/app/shared/modules/shared.module'
import { StudentPageComponent } from './student-page.component'

@NgModule({
    declarations: [StudentPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: StudentPageComponent }]),
    ],
    exports: [StudentPageComponent],
})
export class StudentPageModule {}
