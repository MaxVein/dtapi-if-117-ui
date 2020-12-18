import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
                    if (
                        +response.id !== +response.currentTest.test_id &&
                        !response.currentTest
                    ) {
                        this.playerSubscription = this.testPlayerService
                            .testPlayerResetSession()
                            .subscribe(() => {});
                        this.router.navigate(['/student/profile']);
                        localStorage.setItem('isMatch', 'notMatch');
                    } else {
                        this.currentTest = response.currentTest;
                        this.getTestQA(+response.currentTest.test_id);
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('get'));
                }
            );
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
                this.router.navigate(['/student/profile']);
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
                        this.resetSession();
                    } else if (!result) {
                        this.alertService.message(snackBarMessages('cancel'));
                    }
                }
            );
        } else if (!event.finish && event.time) {
            this.checkTest();
        }
    }

    checkTest(): void {
        this.router.navigate(['/student/test-player/results']);
        // this.playerSubscription = this.testPlayerService.checkDoneTest().subscribe()
    }

    resetSession(): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response) {
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
