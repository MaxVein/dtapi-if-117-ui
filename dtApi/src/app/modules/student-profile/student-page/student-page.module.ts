import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module'
import { StudentPageComponent } from './student-page.component'

@NgModule({
    declarations: [StudentPageComponent],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'student-page', component: StudentPageComponent },
        ]),
    ],
    exports: [StudentPageComponent],
})
export class StudentPageModule {}
