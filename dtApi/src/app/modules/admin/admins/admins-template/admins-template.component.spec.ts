import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AdminsTemplateComponent } from './admins-template.component'

describe('AdminsTemplateComponent', () => {
    let component: AdminsTemplateComponent
    let fixture: ComponentFixture<AdminsTemplateComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminsTemplateComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminsTemplateComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
