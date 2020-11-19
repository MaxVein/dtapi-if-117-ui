import { NgModule } from '@angular/core'
import { Router, RouterModule, Routes } from '@angular/router'
import { AdminGuard } from 'src/app/shared/guards/admin.guard'
import { DashboardComponent } from './dashboard/dashboard.component'
import { GroupsComponent } from './groups/groups.component'
import { ListTableComponent } from './speciality/list-table/list-table.component'
import { StudentsPageComponent } from './students/students-page/students-page.component'
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { SharedModule } from '../../shared/modules/shared.module'
import { CommonModule } from '@angular/common'

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
    declarations: [AdminComponent],
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
        RouterModule.forChild(routes),
    ],
})
export class AdminModule {}
