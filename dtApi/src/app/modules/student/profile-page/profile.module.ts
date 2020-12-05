import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { ProfilePageComponent } from './profile-page.component';
import { ProfileTableComponent } from './profile-table/profile-table.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';

@NgModule({
    declarations: [
        ProfilePageComponent,
        ProfileTableComponent,
        ProfileCardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ProfilePageComponent }]),
    ],
})
export class ProfileModule {}
