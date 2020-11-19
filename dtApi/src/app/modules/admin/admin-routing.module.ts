import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin.component'

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'speciality',
                loadChildren: () =>
                    import('./speciality/speciality.module').then(
                        (m) => m.SpecialityModule
                    ),
            },
            {
                path: 'groups',
                loadChildren: () =>
                    import('./groups/groups.module').then(
                        (m) => m.GroupsModule
                    ),
            },
            {
                path: 'students/:id',
                loadChildren: () =>
                    import('./students/students.module').then(
                        (m) => m.StudentsModule
                    ),
            },
            {
                path: 'tests',
                loadChildren: () =>
                    import('./test/test.module').then((m) => m.TestModule),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AdminRoutingModule {}
