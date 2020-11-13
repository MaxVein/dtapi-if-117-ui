import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'

import { TestModule } from './modules/test/test.module'
import { AppComponent } from './app.component'

@NgModule({
    declarations: [AppComponent],
    imports: [
        NoopAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AngularMaterialModule,
        TestModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
