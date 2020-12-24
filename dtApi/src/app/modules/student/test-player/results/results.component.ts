import { Component } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import {
    RouterResults,
    TestResult,
} from '../../../../shared/interfaces/test-player.interfaces';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
    testResults: TestResult;
    countOfQuestions: number;
    testName: string;
    subjectName: string;

    constructor(private router: Router) {
        this.initTestResults();
    }

    initTestResults(): void {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state) {
            this.getState(navigation);
        } else {
            this.getSessionStorage();
        }
    }

    getState(navigation: Navigation): void {
        const state = navigation.extras.state as RouterResults;
        this.testResults = state.result;
        this.countOfQuestions = state.countOfQuestions;
        this.testName = state.testName;
        this.subjectName = state.subjectName;
        sessionStorage.setItem('result', JSON.stringify(state.result));
        sessionStorage.setItem(
            'countOfQuestions',
            JSON.stringify(state.countOfQuestions)
        );
        sessionStorage.setItem('test_name', JSON.stringify(state.testName));
        sessionStorage.setItem(
            'subject_name',
            JSON.stringify(state.subjectName)
        );
    }

    getSessionStorage(): void {
        this.testResults = JSON.parse(sessionStorage.getItem('result'));
        this.countOfQuestions = JSON.parse(
            sessionStorage.getItem('countOfQuestions')
        );
        this.subjectName = JSON.parse(sessionStorage.getItem('subject_name'));
        this.testName = JSON.parse(sessionStorage.getItem('test_name'));
    }
}
