import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { TestComponent } from './test.component'
import { HttpClientModule } from '@angular/common/http'

const testsRoutes: Routes = [{ path: '', component: TestComponent }]

@NgModule({
    declarations: [TestComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(testsRoutes),
        HttpClientModule,
    ],
})
export class TestModule {}
