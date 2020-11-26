import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsModalComponent } from './students-modal.component';

describe('StudentsModalComponent', () => {
    let component: StudentsModalComponent;
    let fixture: ComponentFixture<StudentsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentsModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
