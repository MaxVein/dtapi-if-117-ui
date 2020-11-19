import { NgModule } from '@angular/core'

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
<<<<<<< HEAD
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { LoginModule } from './modules/login/login.module'
import { StudentProfileModule } from './modules/student-profile/student-profileModule/student-profile.module'
import { SharedModule } from './shared/modules/shared.module'
import { AppComponent } from './app.component'
import { SpecialityModule } from './modules/admin/speciality/speciality.module'
import { GroupsModule } from './modules/admin/groups/groups.module'
import { TestModule } from './modules/admin/test/test.module'
import { DashboardModule } from './modules/admin/dashboard/dashboard.module'

@NgModule({
    declarations: [AppComponent],
=======
import { SharedModule } from './shared/modules/shared.module'

import { AppComponent } from './app.component'
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component'

@NgModule({
    declarations: [AppComponent, NotFoundPageComponent],
>>>>>>> b961fe13060c8a4f46ff84d37515026e691e81a3
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
<<<<<<< HEAD
        AngularMaterialModule,
        TestModule,
        GroupsModule,
        SpecialityModule,
        DashboardModule,
        LoginModule,
        StudentProfileModule,
=======
>>>>>>> b961fe13060c8a4f46ff84d37515026e691e81a3
        SharedModule,
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
