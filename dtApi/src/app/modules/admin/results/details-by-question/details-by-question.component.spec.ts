import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsByQuestionComponent } from './details-by-question.component';

describe('DetailsByQuestionComponent', () => {
    let component: DetailsByQuestionComponent;
    let fixture: ComponentFixture<DetailsByQuestionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DetailsByQuestionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailsByQuestionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
