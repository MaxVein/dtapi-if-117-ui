import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { TestPlayerService } from '../services/test-player.service';
import { Subscription } from 'rxjs';
import {
    QA,
    TestCheck,
    TestDetails,
    TestPlayerSaveData,
} from '../../../shared/interfaces/student.interfaces';
import { ModalService } from '../../../shared/services/modal.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import {
    DialogResult,
    Response,
} from '../../../shared/interfaces/entity.interfaces';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
    selector: 'app-test-player',
    templateUrl: './test-player.component.html',
    styleUrls: ['./test-player.component.scss'],
})
export class TestPlayerComponent implements OnInit, OnDestroy {
    loading = false;
    currentTest: TestDetails;
    testQuestionsAndAnswers: QA[] = [];
    testDone = false;
    playerSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private profileService: ProfileService,
        private testPlayerService: TestPlayerService,
        private modalService: ModalService
    ) {
        this.initCurrentTest();
    }

    ngOnInit(): void {
        this.loading = true;
        this.saveTestProgress(+this.currentTest.test_id);
        this.getLog(+this.currentTest.test_id);
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
    }

    saveTestProgress(id: number): void {
        this.testPlayerService.testPlayerSaveData(+id, true).subscribe(() => {
            this.modalService.showSnackBar('Тест розпочато');
        });
    }

    getLog(id: number): void {
        this.playerSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe((testPlayerSaveData: TestPlayerSaveData) => {
                if (testPlayerSaveData.response === 'Empty slot') {
                    this.testPlayerService.getLog(+id).subscribe(() => {
                        this.getTestQuestions(+id);
                    });
                } else {
                    this.getTestQuestions(+id);
                }
            });
    }

    getTestQuestions(id: number): void {
        this.testPlayerService.getAllQuestionsDataForTest(+id).subscribe(
            (testQuestionsAndAnswers: QA[]) => {
                this.testQuestionsAndAnswers = testQuestionsAndAnswers;
                this.loading = false;
            },
            (error: Response) => {
                this.loading = false;
                this.errorHandler(
                    error,
                    'Помилка',
                    `Сталася помилка! Спробуйте знову`
                );
                this.router.navigate(['/student/profile']);
            }
        );
    }

    checkTest(event: TestCheck): void {
        if (event.finish && !event.time) {
            this.modalService.openModal(
                ConfirmComponent,
                {
                    data: {
                        icon: 'cancel',
                        message: `Ви впевнені, що хочете завершити ${this.currentTest.test_name}?`,
                    },
                },
                (result: DialogResult) => {
                    if (result) {
                        this.testPlayerService
                            .testPlayerResetSession()
                            .subscribe(() => {
                                this.testDone = true;
                                this.modalService.showSnackBar(
                                    'Тест закінчено! Ваш результат'
                                );
                            });
                    } else if (!result) {
                        this.modalService.showSnackBar('Скасовано');
                    }
                }
            );
        }
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
