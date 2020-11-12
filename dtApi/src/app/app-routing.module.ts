import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AppComponent } from './app.component'
import { GroupsComponent } from './groups/groups.component'

const routes: Routes = [
    { path: '', redirectTo: '/groups', pathMatch: 'full' },
    { path: 'groups', component: GroupsComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
