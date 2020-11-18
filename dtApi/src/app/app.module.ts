import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { SpecialityModule } from './speciality/speciality.module'

import { DashboardModule } from './modules/dashboard/dashboard.module'
import { LoginComponent } from './login/login.component'
import { GroupsModule } from './modules/groups/groups.module'

import { TestModule } from './modules/test/test.module'
import { AppComponent } from './app.component'

@NgModule({
    declarations: [AppComponent, LoginComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AngularMaterialModule,
        TestModule,
        GroupsModule,
        DashboardModule,
        SpecialityModule,
        ReactiveFormsModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
