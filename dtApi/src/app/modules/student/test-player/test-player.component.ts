import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestPlayerService } from '../services/test-player.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';
import { TestDetails } from '../../../shared/interfaces/student.interfaces';
import { Response } from '../../../shared/interfaces/entity.interfaces';
import {
    TestPlayerResponse,
    QA,
    TestPlayerQAError,
    AnswerData,
    TestResult,
    TestPlayerSaveData,
    TestPlayerNavigate,
    TestPlayerResetSessionActions,
} from '../../../shared/interfaces/test-player.interfaces';
import { testPlayerMessages, testPlayerServerMessages } from '../Messages';

@Component({
    selector: 'app-test-player',
    templateUrl: './test-player.component.html',
    styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit, OnDestroy {
    loading = false;
    currentTest: TestDetails;
    testQuestionsAndAnswers: QA[] = [];
    studentAnswers: AnswerData[] = [];
    playerSubscription: Subscription;

    @HostListener('window:beforeunload', ['$event'])
    onReloadHandler(event: Event): void {
        event.returnValue = true;
        this.alertService.message(testPlayerMessages('refresh'));
    }

    constructor(
        private router: Router,
        private testPlayerService: TestPlayerService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.initCurrentTest();
    }

    initCurrentTest(): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (
                        response.response === 'Empty slot' ||
                        (response.testPlayerResults && !response.currentTest)
                    ) {
                        this.alertService.warning(
                            testPlayerMessages('emptySlot')
                        );
                        this.alertService.message(
                            testPlayerMessages('notAccess')
                        );
                        response.testPlayerResults
                            ? this.navigateTo('results')
                            : this.navigateTo('profile');
                    } else {
                        this.startTestPlayer(response);
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('get'));
                }
            );
    }

    startTestPlayer(response: TestPlayerResponse): void {
        if (
            !response.id &&
            !response.currentTest &&
            +response.id !== +response.currentTest.test_id
        ) {
            this.alertService.message(testPlayerMessages('notAccess'));
            this.resetSession('notMatch');
        } else {
            this.currentTest = response.currentTest;
            this.getTestQA(+response.currentTest.test_id);
        }
    }

    getTestQA(id: number): void {
        this.playerSubscription = this.testPlayerService
            .getAllQuestionsDataForTest(+id)
            .subscribe(
                (testQuestionsAndAnswers: QA[]) => {
                    this.testQuestionsAndAnswers = testQuestionsAndAnswers;
                    this.loading = false;
                },
                (error: TestPlayerQAError) => {
                    this.loading = false;
                    this.getTestQAErrorHandler(error);
                    this.resetSession('navigate');
                }
            );
    }

    getTestQAErrorHandler(error: TestPlayerQAError): void {
        switch (error.error.response) {
            case testPlayerMessages('withoutMakingQuiz', true):
                this.alertService.error(
                    testPlayerMessages('withoutMakingQuiz', false)
                );
                break;
            case testPlayerMessages('enoughNumber', true):
                this.alertService.error(
                    testPlayerMessages('enoughNumber', false)
                );
                break;
            default:
                this.alertService.error(testPlayerMessages('default'));
                break;
        }
    }

    studentAnswer(event: AnswerData[]): void {
        if (event) {
            this.studentAnswers = event;
            sessionStorage.setItem('test_progress', JSON.stringify(event));
        } else {
            this.alertService.error(testPlayerMessages('notAnswers'));
            this.navigateTo('profile');
        }
    }

    checkTest(): void {
        this.playerSubscription = this.testPlayerService
            .checkDoneTest(this.studentAnswers)
            .subscribe(
                (response: TestResult) => {
                    if (response) {
                        this.saveSession(response);
                    } else {
                        this.alertService.warning(
                            testPlayerMessages('checkEmpty')
                        );
                        this.navigateTo('profile');
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerMessages('checkError'));
                    this.navigateTo('profile');
                }
            );
    }

    saveSession(result: TestResult): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerSaveData({
                testPlayerResults: {
                    result: result,
                    countOfQuestions: this.studentAnswers.length,
                    testName: this.currentTest.test_name,
                    subjectName: this.currentTest.subjectname,
                },
            })
            .subscribe(
                (response: TestPlayerSaveData) => {
                    if (response.response === 'Data has been saved') {
                        this.navigateTo('results');
                    }
                },
                (error: Response) => {
                    this.alertService.error(
                        testPlayerMessages('saveSessionError')
                    );
                    this.navigateTo('profile');
                }
            );
    }

    resetSession(action: TestPlayerResetSessionActions): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response && action === 'notMatch') {
                        this.alertService.warning(
                            testPlayerMessages('isMatch')
                        );
                        this.navigateTo('profile');
                    } else if (response && action === 'navigate') {
                        this.navigateTo('profile');
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('reset'));
                    this.navigateTo('profile');
                }
            );
    }

    navigateTo(navigate: TestPlayerNavigate): void {
        if (navigate === 'results') {
            this.router.navigate(['/student/test-player/results']);
        } else if (navigate === 'profile') {
            this.router.navigate(['/student/profile']);
        }
    }

    ngOnDestroy(): void {
        if (this.playerSubscription) {
            this.playerSubscription.unsubscribe();
        }
    }
}
