import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'

import { MatTabsModule } from '@angular/material/tabs'
import { MatSortModule } from '@angular/material/sort'

import { AngularMaterialModule } from '../../../shared/modules/angular-material/angular-material.module'

import { SubjectsHomeComponent } from './subjects-home/subjects-home.component'
import { SubjectsService } from './subjects.service'
import { ModalComponent } from './modal/modal.component'

const routes: Routes = [{ path: '', component: SubjectsHomeComponent }]

@NgModule({
    declarations: [SubjectsHomeComponent, ModalComponent],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatSortModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule.forChild(routes),
    ],
    exports: [SubjectsHomeComponent, ModalComponent],
    providers: [SubjectsService],
})
export class SubjectsModule {}
