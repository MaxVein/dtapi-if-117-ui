import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { LoginModule } from './modules/login/login.module'
import { StudentPageModule } from './modules/student-profile/student-profileModule/student-profile.module'
import { SharedModule } from './shared/modules/shared.module'

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
        LoginModule,
        StudentPageModule,
        SharedModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
