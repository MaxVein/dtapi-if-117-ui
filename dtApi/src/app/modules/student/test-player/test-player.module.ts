import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ChartsModule } from 'ng2-charts';

import { TestPlayerComponent } from './test-player.component';
import { TimerComponent } from './timer/timer.component';
import { ResultsComponent } from './results/results.component';
import { QuestionsComponent } from './questions/questions.component';
import { AnswersChartComponent } from './results/answers-chart/answers-chart.component';

@NgModule({
    declarations: [
        TestPlayerComponent,
        TimerComponent,
        ResultsComponent,
        QuestionsComponent,
        AnswersChartComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ChartsModule,
        RouterModule.forChild([{ path: '', component: TestPlayerComponent }]),
    ],
})
export class TestPlayerModule {}
