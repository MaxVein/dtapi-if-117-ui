import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TestPlayerService } from '../../services/test-player.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { Observable } from 'rxjs/internal/Observable';
import { interval, Subscription } from 'rxjs';
import { TestDetails } from '../../../../shared/interfaces/student.interfaces';
import {
    Timer,
    TestPlayerEndTime,
    ServerTime,
    TestPlayerResponse,
} from '../../../../shared/interfaces/test-player.interfaces';
import {
    DialogResult,
    Response,
} from '../../../../shared/interfaces/entity.interfaces';
import {
    snackBarMessages,
    testPlayerMessages,
    testPlayerServerMessages,
    timerMessages,
} from '../../Messages';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
    @Input() test: TestDetails;
    @Output() onCheck: EventEmitter<void> = new EventEmitter<void>();
    time: ServerTime = {
        curtime: 0,
        unix_timestamp: 0,
        offset: 0,
    };
    timer: Timer = {
        hours: 0,
        minutes: 0,
        seconds: 0,
    };
    count: number;
    timeForTest: number;
    startDate: number;
    endDate: number;
    timerInterval$: Observable<number> = interval(1000);
    intervalSubscription: Subscription;
    timerSubscription: Subscription;

    constructor(
        private router: Router,
        private testPlayerService: TestPlayerService,
        private modalService: ModalService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.intervalSubscription = this.timerInterval$.subscribe(() => {
            this.createTimer();
        });
        this.getTestTime();
    }

    createTimer(): void {
        this.timer.hours = Math.floor(this.count / (1000 * 60 * 60));
        if (parseInt(this.timer.hours, 10) < 10) {
            this.timer.hours = '0' + this.timer.hours;
        }
        this.timer.minutes = Math.floor(
            (this.count % (1000 * 60 * 60)) / (1000 * 60)
        );
        if (parseInt(this.timer.minutes, 10) < 10) {
            this.timer.minutes = '0' + this.timer.minutes;
        }
        this.timer.seconds = Math.floor((this.count % (1000 * 60)) / 1000);
        if (parseInt(this.timer.seconds, 10) < 10) {
            this.timer.seconds = '0' + this.timer.seconds;
        }
        this.count -= 1000;

        if (this.count <= -1) {
            this.timer.hours = '00';
            this.timer.minutes = '00';
            this.timer.seconds = '00';
            this.finishTest(true);
        }
    }

    getTestTime(): void {
        this.timeForTest = this.test.time_for_test * 60 * 1000;
        this.getServerTimeAndSynchronize();
    }

    getServerTimeAndSynchronize(): void {
        this.timerSubscription = this.testPlayerService
            .getServerTime()
            .subscribe(
                (response: ServerTime) => {
                    this.time.curtime = response.unix_timestamp * 1000;
                    this.startDate = new Date(this.time.curtime).getTime();
                    this.endDate = this.startDate + this.timeForTest;
                    this.count = this.endDate - this.startDate;
                    this.getEndTestTime();
                },
                (error: Response) => {
                    this.alertService.error(timerMessages('syncError'));
                    this.resetSession(false, false, true);
                }
            );
    }

    getEndTestTime(): void {
        this.timerSubscription = this.testPlayerService
            .testPlayerGetEndTime()
            .subscribe(
                (endTime: TestPlayerEndTime) => {
                    if (endTime.response === 'Empty slot') {
                        this.saveTestTime();
                    } else {
                        this.count = endTime.end - this.startDate;
                        if (this.count > this.endDate - this.startDate) {
                            this.count = this.endDate - this.startDate;
                        }
                        if (this.count === undefined) {
                            this.resetSession(true, false, false);
                        }
                    }
                },
                (error: Response) => {
                    this.alertService.error(timerMessages('endError'));
                    this.resetSession(false, false, true);
                }
            );
    }

    saveTestTime(): void {
        this.timerSubscription = this.testPlayerService
            .testPlayerSaveEndTime({
                end: this.startDate + this.count,
            })
            .subscribe(
                (response: TestPlayerEndTime) => {},
                (error: Response) => {
                    this.alertService.error(timerMessages('saveError'));
                    this.resetSession(false, false, true);
                }
            );
    }

    confirmFinishTest(): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'cancel',
                    message: testPlayerMessages(
                        'sureFinish',
                        false,
                        this.test.test_name
                    ),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.resetSession(false, true, false);
                } else if (!result) {
                    this.alertService.message(snackBarMessages('cancel'));
                }
            }
        );
    }

    finishTest(gone: boolean): void {
        if (gone) {
            this.intervalSubscription.unsubscribe();
            this.resetSession(false, false, false);
        } else {
            this.confirmFinishTest();
        }
    }

    resetSession(count: boolean, finish: boolean, error: boolean): void {
        this.timerSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response && count) {
                        this.alertService.error(timerMessages('timerError'));
                        this.router.navigate(['/student/profile']);
                    } else if (response && !count && !finish) {
                        this.alertService.message(
                            testPlayerMessages('finish', false, '', true)
                        );
                        this.onCheck.emit();
                    } else if (response && !count && finish) {
                        this.alertService.message(
                            testPlayerMessages('finish', false, '', false)
                        );
                        this.onCheck.emit();
                    } else if (response && !count && !finish && error) {
                        this.router.navigate(['/student/profile']);
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('reset'));
                    this.router.navigate(['/student/profile']);
                }
            );
    }

    ngOnDestroy(): void {
        if (this.timerSubscription || this.intervalSubscription) {
            this.timerSubscription.unsubscribe();
            this.intervalSubscription.unsubscribe();
        }
    }
}
