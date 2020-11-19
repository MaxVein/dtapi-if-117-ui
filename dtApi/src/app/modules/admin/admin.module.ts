import { ngModuleJitUrl } from '@angular/compiler'
import { NgModule } from '@angular/core'
import { NgModel } from '@angular/forms'
import { Router, RouterModule, Routes } from '@angular/router'
import { AdminGuard } from 'src/app/shared/guards/admin.guard'
import { DashboardComponent } from './dashboard/dashboard.component'
import { GroupsComponent } from './groups/groups.component'
import { ListTableComponent } from './speciality/list-table/list-table.component'
import { StudentsPageComponent } from './students/students-page/students-page.component'

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'speciality',
                component: ListTableComponent,
            },
            {
                path: 'groups',
                component: GroupsComponent,
            },
            {
                path: 'sstudents',
                component: StudentsPageComponent,
            },
        ],
    },
]
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
})
export class AdminModule {}
