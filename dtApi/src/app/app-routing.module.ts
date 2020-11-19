import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './modules/admin/dashboard/dashboard.component'

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'students/:id',
        loadChildren: () =>
            import('./modules/admin/students/students.module').then(
                (m) => m.StudentsModule
            ),
    },
    {
        path: 'student-pag',
        loadChildren: () =>
            import(
                './modules/student-profile/student-page/student-page.module'
            ).then((m) => m.StudentPageModule),
    },
    {
        path: 'tests',
        loadChildren: () =>
            import('./modules/admin/test/test.module').then(
                (m) => m.TestModule
            ),
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
