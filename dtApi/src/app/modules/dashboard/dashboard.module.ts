import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { LayoutModule } from '@angular/cdk/layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'

import { DashboardComponent } from './dashboard.component'

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        LayoutModule,
        MatToolbarModule,
        MatListModule,
    ],
    exports: [DashboardComponent],
})
export class DashboardModule {}
