import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { StudentPageComponent } from './student-page.component';

@NgModule({
    declarations: [StudentPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: StudentPageComponent }]),
    ],
})
export class StudentPageModule {}
