import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { TestDetailesComponent } from './test-detailes.component';
import { TestDetailsDialogComponent } from './test-details-dialog/test-details-dialog.component';

const testDetailsRoutes: Routes = [
    { path: '', component: TestDetailesComponent },
];

@NgModule({
    declarations: [TestDetailesComponent, TestDetailsDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(testDetailsRoutes),
    ],
})
export class TestDetailesModule {}
