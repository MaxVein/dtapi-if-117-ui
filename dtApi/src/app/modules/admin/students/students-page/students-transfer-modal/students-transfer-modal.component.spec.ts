import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsTransferModalComponent } from './students-transfer-modal.component';

describe('StudentsTransferModalComponent', () => {
    let component: StudentsTransferModalComponent;
    let fixture: ComponentFixture<StudentsTransferModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentsTransferModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentsTransferModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
