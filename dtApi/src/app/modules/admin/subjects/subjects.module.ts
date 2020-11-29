import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/modules/shared.module';

import { SubjectsHomeComponent } from './subjects-home/subjects-home.component';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [{ path: '', component: SubjectsHomeComponent }];

@NgModule({
    declarations: [SubjectsHomeComponent, ModalComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [],
})
export class SubjectsModule {}
