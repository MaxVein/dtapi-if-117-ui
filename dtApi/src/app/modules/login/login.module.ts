import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared/modules/shared.module'

import { LoginComponent } from './login.component'

const routes: Routes = [{ path: '', component: LoginComponent }]

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class LoginModule {}
