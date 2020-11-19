import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { SharedModule } from './shared/modules/shared.module'

import { SpecialityModule } from './modules/admin/speciality/speciality.module'
import { GroupsModule } from './modules/admin/groups/groups.module'
import { TestModule } from './modules/admin/test/test.module'
import { DashboardModule } from './modules/admin/dashboard/dashboard.module'
import { LoginComponent } from './modules/login/login.component'
import { AdminModule } from './modules/admin/admin.module'
import { NotFoundComponent } from './shared/components/not-found/not-found.component'
import { AppComponent } from './app.component'
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component'
import { SubjectsModule } from './modules/admin/subjects/subjects.module'

@NgModule({
    declarations: [AppComponent, NotFoundPageComponent],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
