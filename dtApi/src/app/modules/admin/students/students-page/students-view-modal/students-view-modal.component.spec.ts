import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsViewModalComponent } from './students-view-modal.component';

describe('StudentsViewModalComponent', () => {
    let component: StudentsViewModalComponent;
    let fixture: ComponentFixture<StudentsViewModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentsViewModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentsViewModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
