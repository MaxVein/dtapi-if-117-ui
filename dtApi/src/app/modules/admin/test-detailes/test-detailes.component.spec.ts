import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDetailesComponent } from './test-detailes.component';

describe('TestDetailesComponent', () => {
    let component: TestDetailesComponent;
    let fixture: ComponentFixture<TestDetailesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestDetailesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestDetailesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
