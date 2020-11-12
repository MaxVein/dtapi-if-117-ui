import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { SpecialityModule } from './speciality/speciality.module'

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        SpecialityModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
