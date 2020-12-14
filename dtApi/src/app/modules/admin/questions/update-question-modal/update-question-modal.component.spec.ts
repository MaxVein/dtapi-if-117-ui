import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuestionModalComponent } from './update-question-modal.component';

describe('UpdateQuestionModalComponent', () => {
    let component: UpdateQuestionModalComponent;
    let fixture: ComponentFixture<UpdateQuestionModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UpdateQuestionModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateQuestionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
