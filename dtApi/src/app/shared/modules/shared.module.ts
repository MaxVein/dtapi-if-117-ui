import { NgModule } from '@angular/core'
import { LoaderComponent } from '../components/loader/loader.component'
import { AngularMaterialModule } from './angular-material/angular-material.module'

import { ConfirmComponent } from '../components/confirm/confirm.component'
import { AlertComponent } from '../components/alert/alert.component'

import { ConfirmDirective } from '../directives/students/confirm.directive'
import { UniqueDirective } from '../directives/students/unique.directive'

import { ModalService } from '../services/modal.service'

@NgModule({
    declarations: [
        LoaderComponent,
        ConfirmDirective,
        UniqueDirective,
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
        UniqueDirective,
    ],
    providers: [ModalService],
})
export class SharedModule {}
