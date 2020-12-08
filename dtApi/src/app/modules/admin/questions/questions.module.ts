import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { AddUpdateModalComponent } from './add-update-modal/add-update-modal.component';

const routes: Routes = [{ path: '', component: QuestionComponent }];

@NgModule({
    declarations: [
        QuestionComponent,
        DeleteConfirmationModalComponent,
        AddUpdateModalComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [],
})
export class QuestionsModule {}
