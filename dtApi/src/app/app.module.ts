import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { SharedModule } from './shared/modules/shared.module'

import { DashboardModule } from './modules/dashboard/dashboard.module'
import { LoginComponent } from './login/login.component'

@NgModule({
    declarations: [AppComponent, LoginComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DashboardModule,
        SharedModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
