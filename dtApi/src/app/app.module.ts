import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { SpecialityModule } from './speciality/speciality.module'

import { DashboardModule } from './modules/dashboard/dashboard.module'
import { LoginModule } from './modules/login/login.module'
import { StudentProfileModule } from './modules/student-profile/student-profileModule/student-profile.module'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        SpecialityModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DashboardModule,
        LoginModule,
        StudentProfileModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
