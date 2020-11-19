import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './modules/login/login.component'
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component'
import { ListTableComponent } from './modules/admin/speciality/list-table/list-table.component'
import { AdminGuard } from './shared/guards/admin.guard'
import { GroupDialogComponent } from './modules/admin/groups/group-dialog/group-dialog.component'
import { GroupsComponent } from './modules/admin/groups/groups.component'
import { NotFoundComponent } from './shared/components/not-found/not-found.component'
import { StudentGuard } from './shared/guards/student.guard'

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'admin',
        loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminGuard],
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'students/:id',
        loadChildren: () =>
            import('./modules/admin/students/students.module').then(
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
    { path: '**', component: NotFoundComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
