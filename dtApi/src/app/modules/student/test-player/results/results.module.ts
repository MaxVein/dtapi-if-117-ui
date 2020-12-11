import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/modules/shared.module';

import { ResultsComponent } from './results.component';

@NgModule({
    declarations: [ResultsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ResultsComponent }]),
    ],
})
export class ResultsModule {}
