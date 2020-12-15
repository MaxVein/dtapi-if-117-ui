import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '../../../../shared/services/modal.service';
import { ProfileService } from '../../services/profile.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { of, Subscription, from } from 'rxjs';
import { concatMap, mergeMap } from 'rxjs/operators';
import {
    TestDate,
    TestDetails,
} from '../../../../shared/interfaces/student.interfaces';
import {
    DialogResult,
    Response,
    Subject,
} from '../../../../shared/interfaces/entity.interfaces';
import { TestPlayerService } from '../../services/test-player.service';
import {
    TestLog,
    TestLogError,
    TestPlayerResponse,
    TestPlayerSaveData,
} from '../../../../shared/interfaces/test-player.interfaces';
import {
    baseErrorMessage,
    cancelMessage,
    confirmStartTestMessage,
    errorTitleMessage,
    isTestStart,
    notDataRequiredMessage,
    notTestData,
    profileTestMessage,
    testLogError1,
    testLogError2,
    testLogError3,
    testLogError4,
    testLogError5,
    testLogError6,
    testLogError7,
    testNoAvailableMessage,
    testsTableColumns,
    testWillBeAvailableLaterMessage,
    testWillBeAvailableTodayMessage,
    uploadTests,
    warningTitleMessage,
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
        private testPlayerService: TestPlayerService
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
                        this.modalService.showSnackBar(uploadTests(true));
                        return from(this.subjectsIds).pipe(
                            mergeMap((id) =>
                                this.profileService.getTestDate(id)
                            )
                        );
                    } else {
                        this.startText = true;
                        this.testsBySubject = [];
                        this.modalService.showSnackBar(uploadTests(false));
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: Array<TestDate>) => {
                    if (!this.newSubjects.length) {
                        this.getNewSubjects(this.testsBySubject);
                    }
                    this.testsBySubject.forEach((test) => {
                        res.forEach((item) => {
                            if (item.subject_id === test.subject_id) {
                                this.testDetails.push({
                                    ...test,
                                    ...item,
                                    subjectname: this.getSubName(
                                        test.subject_id
                                    ),
                                });
                            }
                        });
                    });
                    this.dataSource.data = this.testDetails;
                    this.dataSource.paginator = this.paginator;
                },
                error: (error: Response) => {
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        baseErrorMessage
                    );
                },
            });
    }

    selectSubject(event: MatSelectChange): void {
        const subjectData = event.value;
        if (subjectData === 'ALL') {
            this.hide = false;
            this.testDetails = [];
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
                        this.modalService.showSnackBar(uploadTests(true));
                        return this.profileService.getTestDetails(this.groupId);
                    } else {
                        this.hide = false;
                        this.testsBySubject = [];
                        this.modalService.showSnackBar(uploadTests(false));
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: TestDate) => {
                    let testDate = res[0] ? res[0] : res;
                    if (testDate.response === 'no records') {
                        testDate = {
                            end_date: notTestData,
                            start_date: notTestData,
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
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        profileTestMessage(this.subjectName)
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
            return testWillBeAvailableTodayMessage(test.start_time);
        } else if (
            this.currentDate > startDateWithTime &&
            this.currentDate > endDate
        ) {
            return testNoAvailableMessage(test.end_date);
        } else if (
            this.currentDate < startDateWithTime &&
            this.currentDate < endDate
        ) {
            return testWillBeAvailableLaterMessage(
                test.start_date,
                test.start_time
            );
        } else {
            return notDataRequiredMessage();
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
                    this.errorHandler(
                        error,
                        warningTitleMessage,
                        this.checkCurrentDate(test)
                    );
                }
            );
    }

    confirmStartTest(test: TestDetails): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'school',
                    message: confirmStartTestMessage(test),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.startTest(test);
                } else if (!result) {
                    this.modalService.showSnackBar(cancelMessage);
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
                        this.modalService.showSnackBar(isTestStart(true));
                        this.testPlayerService
                            .testPlayerSaveData({
                                id: +test.test_id,
                                testInProgress: true,
                            })
                            .subscribe(
                                (response: TestPlayerSaveData) => {
                                    if (response.response) {
                                        this.navigateToTest(test);
                                    }
                                },
                                (error: Response) => {
                                    this.errorHandler(
                                        error,
                                        errorTitleMessage,
                                        isTestStart(false)
                                    );
                                }
                            );
                    }
                },
                (error: TestLogError) => {
                    switch (error.error.response) {
                        case testLogError1(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError1(false)
                            );
                            break;
                        case testLogError2(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError2(false)
                            );
                            break;
                        case testLogError3(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError3(false)
                            );
                            break;
                        case testLogError4(true):
                            this.profileSubscription = this.testPlayerService
                                .testPlayerGetData()
                                .subscribe((response: TestPlayerResponse) => {
                                    if (+response.id === +test.test_id) {
                                        this.navigateToTest(test);
                                    } else {
                                        this.errorHandler(
                                            error.error,
                                            errorTitleMessage,
                                            testLogError4(false)
                                        );
                                    }
                                });
                            break;
                        case testLogError5(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError5(false)
                            );
                            break;
                        case testLogError6(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError6(false)
                            );
                            break;
                        case testLogError7(true):
                            this.errorHandler(
                                error.error,
                                errorTitleMessage,
                                testLogError7(false)
                            );
                            break;
                    }
                }
            );
    }

    navigateToTest(test: TestDetails): void {
        const navigationExtras: NavigationExtras = {
            state: test,
        };
        this.router.navigate(['student/test-player'], navigationExtras);
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
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
