import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

import { FacultiesListComponent } from './faculties-list/faculties-list.component'
import { SharedModule } from '../../../shared/modules/shared.module'

const routes: Routes = [{ path: '', component: FacultiesListComponent }]

@NgModule({
    declarations: [FacultiesListComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
    exports: [FacultiesListComponent],
})
export class FacultiesModule {}
