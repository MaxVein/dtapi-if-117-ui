import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPlayerService } from '../services/test-player.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
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
    areYouSureFinishTestMessage,
    cancelMessage,
    errorTitleMessage,
    sessionErrorMessage,
    testPlayerFinishMessage,
    testPlayerQAError1,
    testPlayerQAError2,
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
        private route: ActivatedRoute,
        private router: Router,
        private testPlayerService: TestPlayerService,
        private modalService: ModalService
    ) {
        this.initCurrentTest();
    }

    ngOnInit(): void {
        this.loading = true;
        this.getTestQuestions(+this.currentTest.test_id);
    }

    initCurrentTest(): void {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state) {
            const state = navigation.extras.state as TestDetails;
            this.currentTest = state;
            localStorage.setItem('test_info', JSON.stringify(state));
        } else {
            this.currentTest = JSON.parse(localStorage.getItem('test_info'));
        }
        this.playerSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe((response: TestPlayerResponse) => {
                if (+response.id !== +this.currentTest.test_id) {
                    this.playerSubscription = this.testPlayerService
                        .testPlayerResetSession()
                        .subscribe(() => {});
                    this.router.navigate(['/student/profile']);
                    localStorage.setItem('isMatch', 'notMatch');
                }
            });
    }

    getTestQuestions(id: number): void {
        this.testPlayerService.getAllQuestionsDataForTest(+id).subscribe(
            (testQuestionsAndAnswers: QA[]) => {
                this.testQuestionsAndAnswers = testQuestionsAndAnswers;
                this.loading = false;
            },
            (error: TestPlayerQAError) => {
                this.loading = false;
                if (error.error.response === testPlayerQAError1(true)) {
                    this.errorHandler(
                        error.error,
                        errorTitleMessage,
                        testPlayerQAError1(false)
                    );
                } else if (error.error.response === testPlayerQAError2(true)) {
                    this.errorHandler(
                        error.error,
                        errorTitleMessage,
                        testPlayerQAError2(false)
                    );
                }
                this.router.navigate(['/student/profile']);
            }
        );
    }

    finishTest(event: TestCheck): void {
        if (event.finish && !event.time) {
            this.modalService.openModal(
                ConfirmComponent,
                {
                    data: {
                        icon: 'cancel',
                        message: areYouSureFinishTestMessage(
                            this.currentTest.test_name
                        ),
                    },
                },
                (result: DialogResult) => {
                    if (result) {
                        this.resetSession();
                    } else if (!result) {
                        this.modalService.showSnackBar(cancelMessage);
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
                        this.modalService.showSnackBar(
                            testPlayerFinishMessage(false)
                        );
                        this.checkTest();
                    }
                },
                (error: Response) => {
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        sessionErrorMessage
                    );
                }
            );
    }

    errorHandler(error: Response, title: string, message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title,
                error,
            },
        });
    }

    ngOnDestroy(): void {
        if (this.playerSubscription) {
            this.playerSubscription.unsubscribe();
        }
    }
}
