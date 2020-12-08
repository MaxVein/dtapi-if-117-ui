import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDetailsDialogComponent } from './test-details-dialog.component';

describe('TestDetailsDialogComponent', () => {
    let component: TestDetailsDialogComponent;
    let fixture: ComponentFixture<TestDetailsDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestDetailsDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestDetailsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
