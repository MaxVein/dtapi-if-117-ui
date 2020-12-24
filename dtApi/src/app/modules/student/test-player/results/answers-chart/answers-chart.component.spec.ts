import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersChartComponent } from './answers-chart.component';

describe('AnswersChartComponent', () => {
    let component: AnswersChartComponent;
    let fixture: ComponentFixture<AnswersChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AnswersChartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnswersChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
