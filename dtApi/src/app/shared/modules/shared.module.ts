import { NgModule } from '@angular/core'
import { LoaderComponent } from '../components/loader/loader.component'
import { AngularMaterialModule } from './angular-material/angular-material.module'

import { ConfirmComponent } from '../components/confirm/confirm.component'
import { AlertComponent } from '../components/alert/alert.component'

import { ConfirmDirective } from '../directives/students/confirm.directive'

import { ModalService } from '../services/modal.service'

@NgModule({
    declarations: [
        LoaderComponent,
        ConfirmDirective,
        ConfirmComponent,
        AlertComponent,
    ],
    imports: [AngularMaterialModule],
    exports: [
        LoaderComponent,
        AngularMaterialModule,
        ConfirmDirective,
        ConfirmComponent,
        AlertComponent,
    ],
    providers: [ModalService],
})
export class SharedModule {}
