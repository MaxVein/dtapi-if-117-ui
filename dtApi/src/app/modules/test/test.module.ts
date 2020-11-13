import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { TestComponent } from './test.component'
import { HttpClientModule } from '@angular/common/http'

import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'

const testsRoutes: Routes = [{ path: '', component: TestComponent }]

@NgModule({
    declarations: [TestComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(testsRoutes),
        HttpClientModule,
        MatPaginatorModule,
        MatTableModule,
    ],
})
export class TestModule {}
