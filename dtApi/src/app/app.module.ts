import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedModule } from './shared/modules/shared.module';

import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';

import { ThemeService } from './shared/services/theme.service';

@NgModule({
    declarations: [AppComponent, NotFoundPageComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        OverlayModule,
    ],
    providers: [ThemeService],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
