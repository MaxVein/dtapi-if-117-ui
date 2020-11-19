import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminGuard } from './shared/guards/admin.guard'

import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component'

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'admin',
        loadChildren: () =>
            import('./modules/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminGuard],
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./modules/login/login.module').then((m) => m.LoginModule),
    },
    { path: '404', component: NotFoundPageComponent },
    { path: '**', redirectTo: '/404' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
