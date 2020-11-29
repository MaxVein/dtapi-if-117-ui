import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/shared.module';

import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [{ path: '', component: AboutPageComponent }];

@NgModule({
    declarations: [AboutPageComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class AboutModule {}
