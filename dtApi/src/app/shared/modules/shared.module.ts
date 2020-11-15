import { NgModule } from '@angular/core'
import { LoaderComponent } from '../components/loader/loader.component'
import { AngularMaterialModule } from './angular-material/angular-material.module'
import { ModalService } from '../services/modal.service'

@NgModule({
    declarations: [LoaderComponent],
    imports: [AngularMaterialModule],
    exports: [LoaderComponent, AngularMaterialModule],
    providers: [ModalService],
})
export class SharedModule {}
