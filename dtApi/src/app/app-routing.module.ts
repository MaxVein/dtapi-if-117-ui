import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './modules/dashboard/dashboard.component'

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    {
        path: '',
        loadChildren: () =>
            import('./students/students.module').then((m) => m.StudentsModule),
    },
    { path: '**', redirectTo: '/' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
