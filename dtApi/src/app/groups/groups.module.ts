import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GroupsComponent } from './groups.component'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
    declarations: [GroupsComponent],
    imports: [CommonModule, HttpClientModule],
    exports: [GroupsComponent],
})
export class GroupsModule {}
