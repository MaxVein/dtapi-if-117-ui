import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared/modules/shared.module'

import { TestComponent } from './test.component'
import { TestModalComponent } from './test-modal/test-modal.component'

const testsRoutes: Routes = [{ path: '', component: TestComponent }]

@NgModule({
    declarations: [TestComponent, TestModalComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(testsRoutes)],
})
export class TestModule {}
