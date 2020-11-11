import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SubjectsHomeComponent } from './subjects-home/subjects-home.component'

const routes: Routes = [{ path: '', component: SubjectsHomeComponent }]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubjectsRoutingModule {}
