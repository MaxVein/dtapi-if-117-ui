import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { LoginComponent } from './login/login.component'
import { StudentComponent } from './student/student.component'

@NgModule({
    declarations: [AppComponent, LoginComponent, StudentComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
