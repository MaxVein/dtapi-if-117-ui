import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { CountdownModule } from 'ngx-countdown';

import { TestPlayerComponent } from './test-player.component';

import { TestPlayerService } from '../services/test-player.service';
import { TimerComponent } from './timer/timer.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
    declarations: [TestPlayerComponent, TimerComponent, ResultsComponent],
    imports: [
        CommonModule,
        SharedModule,
        CountdownModule,
        RouterModule.forChild([{ path: '', component: TestPlayerComponent }]),
    ],
    providers: [TestPlayerService],
})
export class TestPlayerModule {}
