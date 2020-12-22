import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { TestPlayerComponent } from './test-player.component';
import { TimerComponent } from './timer/timer.component';
import { ResultsComponent } from './results/results.component';
import { QuestionsComponent } from './questions/questions.component';

@NgModule({
    declarations: [
        TestPlayerComponent,
        TimerComponent,
        ResultsComponent,
        QuestionsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: TestPlayerComponent }]),
    ],
})
export class TestPlayerModule {}
