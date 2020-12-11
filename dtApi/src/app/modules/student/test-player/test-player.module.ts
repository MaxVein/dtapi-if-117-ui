import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { TestPlayerComponent } from './test-player.component';

import { TimerComponent } from './timer/timer.component';

@NgModule({
    declarations: [TestPlayerComponent, TimerComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: TestPlayerComponent }]),
    ],
})
export class TestPlayerModule {}
