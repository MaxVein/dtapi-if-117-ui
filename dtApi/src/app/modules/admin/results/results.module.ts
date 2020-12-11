import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ResultsComponent } from './results.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
import { DetailsByQuestionComponent } from './details-by-question/details-by-question.component';

const routes: Routes = [{ path: '', component: ResultsComponent }];

@NgModule({
    declarations: [
        ResultsComponent,
        DetailDialogComponent,
        DetailsByQuestionComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ResultsComponent }]),
    ],
    exports: [ResultsComponent],
})
export class ResultsModule {}
