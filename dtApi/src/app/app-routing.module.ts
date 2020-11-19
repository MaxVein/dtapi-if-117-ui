import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component'

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./modules/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'student-page',
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
    {
        path: 'admin',
        loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
    },
    { path: '404', component: NotFoundPageComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
