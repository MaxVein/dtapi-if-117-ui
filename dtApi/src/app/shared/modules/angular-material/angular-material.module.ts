import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'

@NgModule({
    declarations: [],
    imports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
    ],
    exports: [
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
    ],
})
export class AngularMaterialModule {}
