import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminGuard } from './shared/guards/admin.guard'
import { StudentGuard } from './shared/guards/student.guard'

import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component'
import { LoggedGuard } from './shared/guards/logged.guard'

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'login',
        loadChildren: () =>
            import('./modules/login/login.module').then((m) => m.LoginModule),
        canActivate: [LoggedGuard],
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminGuard],
    },
    {
        path: 'student',
        loadChildren: () =>
            import(
                './modules/student-profile/student-page/student-page.module'
            ).then((m) => m.StudentPageModule),
        canActivate: [StudentGuard],
    },
    { path: '404', component: NotFoundPageComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
