import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StudentPageComponent } from './student-page.component'

describe('StudentComponent', () => {
    let component: StudentPageComponent
    let fixture: ComponentFixture<StudentPageComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentPageComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentPageComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
