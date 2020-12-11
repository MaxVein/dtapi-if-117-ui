import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AnswersComponent } from './answers.component';

const routes: Routes = [{ path: '', component: AnswersComponent }];
@NgModule({
    declarations: [AnswersComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialFileInputModule,
        RouterModule.forChild(routes),
    ],
})
export class AnswersModule {}
