import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsHomeComponent } from './subjects-home.component';

describe('SubjectsHomeComponent', () => {
    let component: SubjectsHomeComponent;
    let fixture: ComponentFixture<SubjectsHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubjectsHomeComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SubjectsHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
