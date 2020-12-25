import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TestPlayerService } from '../services/test-player.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { TestDetails } from '../../../shared/interfaces/student.interfaces';
import {
    DialogResult,
    Response,
} from '../../../shared/interfaces/entity.interfaces';
import {
    TestPlayerResponse,
    QA,
    TestCheck,
    TestPlayerQAError,
    AnswerData,
    TestResult,
    TestPlayerNavigate,
} from '../../../shared/interfaces/test-player.interfaces';
import {
    snackBarMessages,
    testPlayerMessages,
    testPlayerServerMessages,
} from '../Messages';

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
    }

    constructor(
        private router: Router,
        private testPlayerService: TestPlayerService,
        private modalService: ModalService,
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
                    if (response.response === 'Empty slot') {
                        this.alertService.warning(
                            testPlayerMessages('emptySlot')
                        );
                        this.navigateTo('profile');
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
            this.resetSession(false);
            this.navigateTo('profile');
            localStorage.setItem('isMatch', 'notMatch');
        } else {
            this.currentTest = response.currentTest;
            this.getTestQA(+response.currentTest.test_id);
        }
    }

    getTestQA(id: number): void {
        this.testPlayerService.getAllQuestionsDataForTest(+id).subscribe(
            (testQuestionsAndAnswers: QA[]) => {
                this.testQuestionsAndAnswers = testQuestionsAndAnswers;
                this.loading = false;
            },
            (error: TestPlayerQAError) => {
                this.loading = false;
                this.getTestQAErrorHandler(error);
                this.navigateTo('profile');
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

    finishTest(event: TestCheck): void {
        if (event.finish && !event.time) {
            this.modalService.openModal(
                ConfirmComponent,
                {
                    data: {
                        icon: 'cancel',
                        message: testPlayerMessages(
                            'sureFinish',
                            false,
                            this.currentTest.test_name
                        ),
                    },
                },
                (result: DialogResult) => {
                    if (result) {
                        this.resetSession(true);
                    } else if (!result) {
                        this.alertService.message(snackBarMessages('cancel'));
                    }
                }
            );
        } else if (!event.finish && event.time) {
            this.checkTest();
        }
    }

    studentAnswer(event: AnswerData[]): void {
        this.studentAnswers = event;
        sessionStorage.setItem('test_progress', JSON.stringify(event));
    }

    checkTest(): void {
        this.playerSubscription = this.testPlayerService
            .checkDoneTest(this.studentAnswers)
            .subscribe(
                (response: TestResult) => {
                    this.navigateTo('results', response);
                },
                (error: Response) => {
                    this.alertService.error(testPlayerMessages('checkError'));
                    this.navigateTo('profile');
                }
            );
    }

    navigateTo(navigate: TestPlayerNavigate, result?: TestResult): void {
        if (navigate === 'results') {
            const navigationExtras: NavigationExtras = {
                state: {
                    result: result,
                    countOfQuestions: this.testQuestionsAndAnswers.length,
                    testName: this.currentTest.test_name,
                    subjectName: this.currentTest.subjectname,
                },
            };
            this.router.navigate(
                ['/student/test-player/results'],
                navigationExtras
            );
        } else if (navigate === 'profile') {
            this.router.navigate(['/student/profile']);
        }
    }

    resetSession(finish: boolean): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response && finish) {
                        this.alertService.message(
                            testPlayerMessages('finish', false, '', false)
                        );
                        this.checkTest();
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('reset'));
                }
            );
    }

    ngOnDestroy(): void {
        if (this.playerSubscription) {
            this.playerSubscription.unsubscribe();
        }
    }
}
