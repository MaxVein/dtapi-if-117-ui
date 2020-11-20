import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import { LoginComponent } from './login.component'
import { AngularMaterialModule } from '../../shared/modules/angular-material/angular-material.module'

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule.forChild([{ path: '', component: LoginComponent }]),
    ],
    exports: [LoginComponent],
})
export class LoginModule {}