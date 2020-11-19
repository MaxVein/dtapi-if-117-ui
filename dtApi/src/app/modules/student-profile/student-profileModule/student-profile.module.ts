import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'

import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module'
import { StudentProfileComponent } from '../student-profile.component'

@NgModule({
    declarations: [StudentProfileComponent],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule.forChild([
            { path: 'studentProfile', component: StudentProfileComponent },
        ]),
    ],
    exports: [StudentProfileComponent],
})
export class StudentPageModule {}
