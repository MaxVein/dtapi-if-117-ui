import { NgModule } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
    declarations: [],
    imports: [
        MatIconModule,
        MatButtonModule,
        MatInputModule,
    ],
    exports: [
        MatIconModule,
        MatButtonModule,
        MatInputModule,
    ],
})
export class AngularMaterialModule {}
