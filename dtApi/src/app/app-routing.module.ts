import { NgModule } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './modules/login/login.component'
import { StatisticsComponent } from './modules/admin/statistics/statistics.component'
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component'
import { ListTableComponent } from './modules/admin/speciality/list-table/list-table.component'
import { GroupsComponent } from './modules/admin/groups/groups.component'

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [],
        children: [
            { path: 'statistics', component: StatisticsComponent },
            { path: 'speciality', component: ListTableComponent },
            { path: 'groups', component: GroupsComponent },
            {
                path: 'students/:id',
                loadChildren: () =>
                    import('./modules/admin//students/students.module').then(
                        (m) => m.StudentsModule
                    ),
            },
            {
                path: 'tests',
                loadChildren: () =>
                    import('./modules/admin/test/test.module').then(
                        (m) => m.TestModule
                    ),
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
