import { Component, Input, OnInit } from '@angular/core';
import { TestResult } from '../../../../../shared/interfaces/test-player.interfaces';
import { Color, Label } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
    selector: 'app-answers-chart',
    templateUrl: './answers-chart.component.html',
})
export class AnswersChartComponent implements OnInit {
    @Input() testResults: TestResult;
    @Input() countOfQuestions: number;
    answersChartData: Array<number> = [];
    answersChartLabels: Label[] = [
        'Правильні відповіді',
        'Неправильні відповіді',
    ];
    answersChartType: ChartType = 'pie';
    answersChartColors: Color[] = [{ backgroundColor: ['#69f0ae', '#f44336'] }];
    answersChartOptions: any = {
        legend: {
            position: 'bottom',
            display: true,
            align: 'start',
            labels: {
                fontSize: 16,
                fontColor: 'black',
                padding: 20,
            },
        },
    };

    ngOnInit(): void {
        const trueAnswers: number = this.testResults.number_of_true_answers;
        const falseAnswers: number = this.countOfQuestions - trueAnswers;
        this.answersChartData.push(trueAnswers, falseAnswers);
    }
}
