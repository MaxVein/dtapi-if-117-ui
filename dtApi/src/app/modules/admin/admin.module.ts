import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from './admin.component'
import { SharedModule } from '../../shared/modules/shared.module'

@NgModule({
    declarations: [AdminComponent],
    imports: [CommonModule, SharedModule, AdminRoutingModule],
    providers: [],
    exports: [],
})
export class AdminModule {}
