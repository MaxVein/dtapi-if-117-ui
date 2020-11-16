import { NgModule } from '@angular/core'
import { LoaderComponent } from '../components/loader/loader.component'
import { AngularMaterialModule } from './angular-material/angular-material.module'
import { ModalService } from '../services/modal.service'
import { ConfirmDirective } from '../directives/students/confirm.directive'

@NgModule({
    declarations: [LoaderComponent, ConfirmDirective],
    imports: [AngularMaterialModule],
    exports: [LoaderComponent, AngularMaterialModule, ConfirmDirective],
    providers: [ModalService],
})
export class SharedModule {}
