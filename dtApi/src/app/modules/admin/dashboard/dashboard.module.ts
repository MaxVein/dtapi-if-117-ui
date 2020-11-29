import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { DashboardComponent } from './dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
    declarations: [DashboardComponent, StatisticsComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
