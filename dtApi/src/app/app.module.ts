import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { LoginModule } from './modules/login/login.module'
import { StudentPageModule } from './modules/student-profile/student-page/student-page.module'
import { SharedModule } from './shared/modules/shared.module'

import { SpecialityModule } from './modules/admin/speciality/speciality.module'
import { GroupsModule } from './modules/admin/groups/groups.module'
import { DashboardModule } from './modules/admin/dashboard/dashboard.module'
import { LoginComponent } from './modules/login/login.component'
import { AdminModule } from './modules/admin/admin.module'
import { NotFoundComponent } from './shared/components/not-found/not-found.component'

import { AppComponent } from './app.component'

@NgModule({
    declarations: [AppComponent, NotFoundComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AngularMaterialModule,
        GroupsModule,
        SpecialityModule,
        DashboardModule,
        LoginModule,
        StudentPageModule,
        SharedModule,
    ],
    providers: [],
    exports: [AngularMaterialModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
