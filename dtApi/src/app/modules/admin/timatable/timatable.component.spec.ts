import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimatableComponent } from './timatable.component';

describe('TimatableComponent', () => {
    let component: TimatableComponent;
    let fixture: ComponentFixture<TimatableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimatableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimatableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
