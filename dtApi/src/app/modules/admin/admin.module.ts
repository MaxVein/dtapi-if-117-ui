import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { OverlayModule } from '@angular/cdk/overlay';

import { AdminComponent } from './admin.component';

@NgModule({
    declarations: [AdminComponent],
    imports: [CommonModule, SharedModule, AdminRoutingModule, OverlayModule],
})
export class AdminModule {}
