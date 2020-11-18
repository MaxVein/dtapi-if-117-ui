import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { SpecialityModule } from './speciality/speciality.module'

import { DashboardModule } from './modules/dashboard/dashboard.module'
import { LoginModule } from './modules/login/login.module'
import { StudentProfileModule } from './modules/student-profile/student-profileModule/student-profile.module'

import { GroupsModule } from './modules/groups/groups.module'
import { SharedModule } from './shared/modules/shared.module'
import { TestModule } from './modules/test/test.module'
import { AppComponent } from './app.component'

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
