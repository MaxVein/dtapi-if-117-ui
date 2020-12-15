import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimatableComponent } from './timatable.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/modules/shared.module';
import { TimetableDialogComponent } from './timetable-dialog/timetable-dialog.component';

const testDetailsRoutes: Routes = [{ path: '', component: TimatableComponent }];

@NgModule({
    declarations: [TimatableComponent, TimetableDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(testDetailsRoutes),
    ],
})
export class TimatableModule {}
