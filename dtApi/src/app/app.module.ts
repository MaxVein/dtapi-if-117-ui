import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
<<<<<<< HEAD
import { SpecialityModule } from './speciality/speciality.module'

import { DashboardModule } from './modules/dashboard/dashboard.module'
import { LoginModule } from './modules/login/login.module'
import { StudentProfileModule } from './modules/student-profile/student-profileModule/student-profile.module'
=======
>>>>>>> 3aa30a5fbe3b8c402bb0e0a547c7c3fc3b7be335

import { GroupsModule } from './modules/groups/groups.module'
import { SharedModule } from './shared/modules/shared.module'
import { AppComponent } from './app.component'

import { SpecialityModule } from './modules/admin/speciality/speciality.module'
import { GroupsModule } from './modules/admin/groups/groups.module'
import { TestModule } from './modules/admin/test/test.module'
import { DashboardModule } from './modules/admin/dashboard/dashboard.module'
import { LoginComponent } from './modules/login/login.component'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AngularMaterialModule,
        TestModule,
        GroupsModule,
        SpecialityModule,
        DashboardModule,
        LoginModule,
        StudentProfileModule,
        SharedModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
