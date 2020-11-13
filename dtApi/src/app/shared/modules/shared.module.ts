import { NgModule } from '@angular/core'
import { LoaderComponent } from '../components/loader/loader.component'
import { AngularMaterialModule } from './angular-material/angular-material.module'

@NgModule({
    declarations: [LoaderComponent],
    imports: [AngularMaterialModule],
    exports: [LoaderComponent, AngularMaterialModule],
})
export class SharedModule {}
