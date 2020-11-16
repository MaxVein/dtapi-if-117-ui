import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { from } from 'rxjs'

import { LoginComponent } from './login/login.component'
import { StudentComponent } from './student/student.component'

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'student', component: StudentComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
