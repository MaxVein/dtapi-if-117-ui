import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModalCreationComponent } from './admin-modal-creation.component';

describe('AdminModalCreationComponent', () => {
    let component: AdminModalCreationComponent;
    let fixture: ComponentFixture<AdminModalCreationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminModalCreationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminModalCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
