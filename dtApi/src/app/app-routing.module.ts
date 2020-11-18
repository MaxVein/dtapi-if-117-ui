import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './modules/dashboard/dashboard.component'

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
  {
    path: 'students/:id',
    loadChildren: () =>
      import('./students/students.module').then((m) => m.StudentsModule),
  },
  {
        path: 'tests',
        loadChildren: () =>
            import('./modules/test/test.module').then((m) => m.TestModule),
    },
    { path: '**', redirectTo: '/' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
