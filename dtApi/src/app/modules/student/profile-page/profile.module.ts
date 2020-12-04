import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { ProfilePageComponent } from './profile-page.component';

@NgModule({
    declarations: [ProfilePageComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ProfilePageComponent }]),
    ],
})
export class ProfileModule {}
