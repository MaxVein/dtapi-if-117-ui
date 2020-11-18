import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { SharedModule } from './shared/modules/shared.module'
import { AppComponent } from './app.component'

import { SpecialityModule } from './modules/admin/speciality/speciality.module'
import { GroupsModule } from './modules/admin/groups/groups.module'
import { TestModule } from './modules/admin/test/test.module'
import { DashboardModule } from './modules/admin/dashboard/dashboard.module'
import { LoginComponent } from './modules/login/login.component'

@NgModule({
    declarations: [AppComponent, LoginComponent],
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
        SharedModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
