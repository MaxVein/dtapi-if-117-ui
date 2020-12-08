import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { TestPlayerService } from '../../services/test-player.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { interval, Subscription } from 'rxjs';
import {
    ServerTime,
    TestCheck,
    TestDetails,
    TestPlayerEndTime,
} from '../../../../shared/interfaces/student.interfaces';
import { CountdownEvent } from 'ngx-countdown';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
    @Input() test: TestDetails;
    @Output() onCheck: EventEmitter<TestCheck> = new EventEmitter<TestCheck>();
    timer: number;
    timeForTest: number;
    studentCurrentTime: number;
    timerInterval = interval(60000);
    timerSubscription: Subscription;

    constructor(
        private testPlayerService: TestPlayerService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.getTestTime();
        this.getStudentTime();
        this.saveTestTime();
        this.timerSubscription = this.timerInterval.subscribe(() => {
            this.getServerTimeAndSynchronize();
        });
    }

    getTestTime(): void {
        const testTime = this.test.time_for_test * 60;
        this.timer = testTime;
        this.timeForTest = testTime;
    }

    getStudentTime(): void {
        this.studentCurrentTime = Math.floor(Date.now() / 1000) + 7200;
    }

    getServerTimeAndSynchronize(): void {
        this.timerSubscription = this.testPlayerService
            .getServerTime()
            .subscribe((response: ServerTime) => {
                this.timer =
                    this.timeForTest -
                    (response.curtime - this.studentCurrentTime);
            });
    }

    saveTestTime(): void {
        this.timerSubscription = this.testPlayerService
            .testPlayerGetEndTime()
            .subscribe((endTime: TestPlayerEndTime) => {
                if (endTime.response === 'Empty slot') {
                    this.testPlayerService
                        .testPlayerSaveEndTime({
                            end: this.timer,
                        })
                        .subscribe(() => {});
                } else {
                    this.timer = endTime.end;
                }
            });
    }

    finishTest(): void {
        this.onCheck.emit({ time: false, finish: true });
    }

    timeGone(event: CountdownEvent): void {
        if (event.action === 'done') {
            this.onCheck.emit({ time: true, finish: false });
            this.modalService.showSnackBar('Ваш час вийшов!');
        }
    }

    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }
}
