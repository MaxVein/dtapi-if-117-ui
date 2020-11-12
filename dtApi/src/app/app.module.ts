import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AngularMaterialModule } from './shared/modules/angular-material/angular-material.module'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'

import { GroupsComponent } from './groups/groups.component'
import { CreateGroupDialogComponent } from './groups/create-group-dialog/create-group-dialog.component'

@NgModule({
    declarations: [AppComponent, GroupsComponent, CreateGroupDialogComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
