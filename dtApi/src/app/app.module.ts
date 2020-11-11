import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { SubjectsModule } from './subjects/subjects.module'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AngularMaterialModule,
        SubjectsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
