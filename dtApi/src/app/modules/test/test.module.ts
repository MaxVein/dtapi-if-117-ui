import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'

import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { TestComponent } from './test.component'

const testsRoutes: Routes = [{ path: 'test', component: TestComponent }]

@NgModule({
    declarations: [TestComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(testsRoutes),
        HttpClientModule,
        MatPaginatorModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class TestModule {}
