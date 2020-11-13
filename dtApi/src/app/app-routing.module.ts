import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GroupsComponent } from './modules/groups/groups.component'

const routes: Routes = [{ path: 'groups', component: GroupsComponent }]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
