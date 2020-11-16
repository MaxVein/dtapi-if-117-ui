import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { GroupsComponent } from './groups.component'
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module'
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component'
import { GroupDialogComponent } from './group-dialog/group-dialog.component'

@NgModule({
    declarations: [
        GroupsComponent,
        ConfirmDeleteComponent,
        GroupDialogComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        AngularMaterialModule,
        FormsModule,
    ],
    exports: [GroupsComponent],
})
export class GroupsModule {}
