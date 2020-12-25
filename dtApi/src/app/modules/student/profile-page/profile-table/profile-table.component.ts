import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '../../../../shared/services/modal.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ProfileService } from '../../services/profile.service';
import { TestPlayerService } from '../../services/test-player.service';
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { of, Subscription, from, forkJoin } from 'rxjs';
import { concatMap, mergeMap, map } from 'rxjs/operators';
import {
    TestDate,
    TestDetails,
} from '../../../../shared/interfaces/student.interfaces';
import {
    DialogResult,
    Response,
    Subject,
} from '../../../../shared/interfaces/entity.interfaces';
import {
    TestLog,
    TestLogError,
    TestPlayerResponse,
    TestPlayerSaveData,
} from '../../../../shared/interfaces/test-player.interfaces';
import {
    testsTableColumns,
    checkTestDateMessages,
    scheduleMessages,
    snackBarMessages,
    startTestPlayerMessages,
} from '../../Messages';

@Component({
    selector: 'app-profile-table',
    templateUrl: './profile-table.component.html',
    styleUrls: ['./profile-table.component.scss'],
})
export class ProfileTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() subjects: Subject[];
    @Input() groupId: number;
    newSubjects = [];
    subjectsIds: Array<string>;
    currentDate: Date;
    subjectName: string;
    subjectID: string;
    hide = false;
    startText = false;
    testsBySubject: TestDetails[] = [];
    testDetails: TestDate[] = [];
    allTestDetails: TestDate[] = [];
    dataSource = new MatTableDataSource<TestDate>();
    displayedColumns: string[] = testsTableColumns;
    profileSubscription: Subscription;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        public modalService: ModalService,
        private router: Router,
        private profileService: ProfileService,
        private testPlayerService: TestPlayerService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.currentDate = new Date();
        this.hide = true;
        this.getTestInfoByGroup();
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getTestInfoByGroup(): void {
        this.dataSource = new MatTableDataSource();
        this.profileSubscription = this.profileService
            .getTestDetails(this.groupId)
            .pipe(
                mergeMap((res: TestDetails[]) => {
                    if (res.length) {
                        this.testsBySubject = res;
                        this.subjectsIds = res.map((item) => item.subject_id);
                        this.alertService.message(scheduleMessages('isTests'));
                        const observables = this.subjectsIds.map((id) =>
                            this.profileService.getTestDate(id)
                        );
                        return forkJoin(observables);
                    } else {
                        this.startText = true;
                        this.testsBySubject = [];
                        this.alertService.message(scheduleMessages('noTests'));
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: []) => {
                    if (!this.newSubjects.length) {
                        this.getNewSubjects(this.testsBySubject);
                    }
                    this.testsBySubject.forEach((test) => {
                        let detailes: any;
                        res.forEach((item: []) => {
                            detailes = item.forEach((elem: TestDate) => {
                                if (elem.subject_id === test.subject_id) {
                                    detailes = {
                                        ...test,
                                        ...elem,
                                        subjectname: this.getSubName(
                                            test.subject_id
                                        ),
                                    };
                                    this.testDetails.push(detailes);
                                }
                            });
                        });
                    });
                    this.dataSource.data = this.testDetails;
                    this.dataSource.paginator = this.paginator;
                },
                error: (error: Response) => {
                    this.alertService.error(
                        scheduleMessages('activeTestsError')
                    );
                },
            });
    }

    selectSubject(event: MatSelectChange): void {
        const subjectData = event.value;
        if (subjectData === 'ALL') {
            this.getTestInfoByGroup();
        } else {
            this.subjectID = subjectData.id;
            this.subjectName = subjectData.name;
            this.getTestInfo();
        }
    }

    getTestInfo(): void {
        this.profileSubscription = this.profileService
            .getTestDate(this.subjectID)
            .pipe(
                concatMap((res: TestDetails[]) => {
                    if (res.length) {
                        this.testsBySubject = res;
                        this.alertService.message(scheduleMessages('isTests'));
                        return this.profileService.getTestDetails(this.groupId);
                    } else {
                        this.hide = false;
                        this.testsBySubject = [];
                        this.alertService.message(scheduleMessages('noTests'));
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: TestDate) => {
                    let testDate = res[0] ? res[0] : res;
                    if (testDate.response === 'no records') {
                        testDate = {
                            end_date: scheduleMessages('noTestData'),
                            start_date: scheduleMessages('noTestData'),
                        };
                    }
                    this.testDetails = [...this.testsBySubject].map((test) => ({
                        ...test,
                        ...testDate,
                        subjectname: this.subjectName,
                    }));
                    this.dataSource = new MatTableDataSource(this.testDetails);
                    this.dataSource.paginator = this.paginator;
                },
                error: (error: Response) => {
                    this.alertService.error(
                        scheduleMessages('subjectTestsError', this.subjectName)
                    );
                },
            });
    }

    getSubName(id: string): string {
        const currentSpec = this.subjects.filter(
            (item) => item.subject_id === id
        );
        return currentSpec[0].subject_name;
    }

    getNewSubjects(res: TestDetails[]): void {
        res.forEach((elem) => {
            const newElem = this.subjects.filter(
                (item) => elem.subject_id === item.subject_id
            );
            this.newSubjects.push(newElem[0]);
        });
    }

    checkCurrentDate(test: TestDate | any): string {
        const startDate = new Date(`${test.start_date}`);
        const startDateWithTime = new Date(
            `${test.start_date} ${test.start_time}`
        );
        const endDate = new Date(`${test.end_date} ${test.end_time}`);
        if (this.currentDate >= startDate && this.currentDate <= endDate) {
            return checkTestDateMessages('willBeAvailableToday', test);
        } else if (
            this.currentDate > startDateWithTime &&
            this.currentDate > endDate
        ) {
            return checkTestDateMessages('noAvailable', test);
        } else if (
            this.currentDate < startDateWithTime &&
            this.currentDate < endDate
        ) {
            return checkTestDateMessages('willBeAvailableLater', test);
        } else {
            return checkTestDateMessages('notData', test);
        }
    }

    checkPossibilityToPassTest(test: TestDetails): void {
        this.profileSubscription = this.profileService
            .testPlayerGetTest(test.test_id)
            .subscribe(
                () => {
                    this.confirmStartTest(test);
                },
                (error: Response) => {
                    this.alertService.warning(this.checkCurrentDate(test));
                }
            );
    }

    confirmStartTest(test: TestDetails): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'school',
                    message: scheduleMessages('confirmStartTest', '', test),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.startTest(test);
                } else if (!result) {
                    this.alertService.message(snackBarMessages('cancel'));
                }
            }
        );
    }

    startTest(test: TestDetails): void {
        this.profileSubscription = this.testPlayerService
            .getLog(+test.test_id)
            .subscribe(
                (log: TestLog) => {
                    if (log.response === 'ok') {
                        this.saveSession(test);
                        this.modalService.showSnackBar(
                            startTestPlayerMessages('startTest')
                        );
                    }
                },
                (error: TestLogError) => {
                    this.startTestErrorHandler(error, test);
                }
            );
    }

    saveSession(test: TestDetails): void {
        this.profileSubscription = this.testPlayerService
            .testPlayerSaveData({
                id: +test.test_id,
                testInProgress: true,
                currentTest: test,
            })
            .subscribe(
                (response: TestPlayerSaveData) => {
                    if (response.response) {
                        this.router.navigate(['student/test-player']);
                    }
                },
                (error: Response) => {
                    this.alertService.error(
                        startTestPlayerMessages('saveSessionError')
                    );
                }
            );
    }

    getSession(test: TestDetails): void {
        this.profileSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (+response.id === +test.test_id) {
                        this.router.navigate(['student/test-player']);
                    } else {
                        this.alertService.error(
                            startTestPlayerMessages('makingTest', false)
                        );
                    }
                },
                (error: Response) => {
                    this.alertService.error(
                        startTestPlayerMessages('getSessionError')
                    );
                }
            );
    }

    startTestErrorHandler(error: TestLogError, test: TestDetails): void {
        switch (error.error.response) {
            case startTestPlayerMessages('scheduleError', true):
                this.alertService.error(
                    startTestPlayerMessages('scheduleError', false)
                );
                break;
            case startTestPlayerMessages('numberOfQuestions', true):
                this.alertService.error(
                    startTestPlayerMessages('numberOfQuestions', false)
                );
                break;
            case startTestPlayerMessages('allAttempts', true):
                this.alertService.error(
                    startTestPlayerMessages('allAttempts', false)
                );
                break;
            case startTestPlayerMessages('makingTest', true):
                this.getSession(test);
                break;
            case startTestPlayerMessages('onlyForYou', true):
                this.alertService.error(
                    startTestPlayerMessages('onlyForYou', false)
                );
                break;
            case startTestPlayerMessages('paramsNotFound', true):
                this.alertService.error(
                    startTestPlayerMessages('paramsNotFound', false)
                );
                break;
            case startTestPlayerMessages('madeRecently', true):
                this.alertService.error(
                    startTestPlayerMessages('madeRecently', false)
                );
                break;
            default:
                this.alertService.error(startTestPlayerMessages('default'));
                break;
        }
    }

    ngOnDestroy(): void {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
