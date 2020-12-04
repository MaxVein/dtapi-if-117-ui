import { NgModule } from '@angular/core';
import { TestPlayerComponent } from './test-player.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [TestPlayerComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: TestPlayerComponent }]),
    ],
})
export class TestPlayerModule {}
