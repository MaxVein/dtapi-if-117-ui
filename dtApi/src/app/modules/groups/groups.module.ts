import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { GroupsComponent } from './groups.component'
import { CreateGroupDialogComponent } from './create-group-dialog/create-group-dialog.component'
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component'
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material/angular-material.module'
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component'

@NgModule({
    declarations: [
        GroupsComponent,
        CreateGroupDialogComponent,
        EditGroupDialogComponent,
        ConfirmDeleteComponent,
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
