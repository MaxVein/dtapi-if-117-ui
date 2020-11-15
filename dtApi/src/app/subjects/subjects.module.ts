import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ReactiveFormsModule } from '@angular/forms'

import { SubjectsRoutingModule } from './subjects-routing.module'
import { SubjectsHomeComponent } from './subjects-home/subjects-home.component'
import { SubjectsService } from './subjects.service';
import { ModalComponent } from './modal/modal.component'

//////////////////////////////
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    declarations: [SubjectsHomeComponent, ModalComponent ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        SubjectsRoutingModule,
        MatTabsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatCardModule,
        MatTooltipModule,
        ReactiveFormsModule,

        //////////////////
        MatDialogModule
    ],
    exports: [SubjectsHomeComponent],
    providers: [SubjectsService],
})
export class SubjectsModule {}
