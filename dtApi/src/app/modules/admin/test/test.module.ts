import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { TestComponent } from './test.component';
import { TestModalComponent } from './test-modal/test-modal.component';
import { ImportExportDialogComponent } from './import-export-dialog/import-export-dialog.component';

const testsRoutes: Routes = [{ path: '', component: TestComponent }];

@NgModule({
    declarations: [
        TestComponent,
        TestModalComponent,
        ImportExportDialogComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialFileInputModule,
        RouterModule.forChild(testsRoutes),
    ],
})
export class TestModule {}
