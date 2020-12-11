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
    testsByGroup: TestDetails[] = [];

    testDetails: TestDate[] = [];
    allTestDetails: TestDate[] = [];
    dataSource = new MatTableDataSource<TestDate>();
    displayedColumns: string[] = [
        'Предмет',
        'Тест',
        'Початок',
        'Кінець',
        'Кількість завдань',
        'Тривалість тесту',
        'Кількість спроб',
        'Почати тестування',
    ];
    profileSubscription: Subscription;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        public modalService: ModalService,
        private router: Router,
        private profileService: ProfileService
    ) {}

    ngOnInit(): void {
        this.currentDate = new Date();
        this.hide = true;
        this.startText = true;
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

    selectSubject(event: MatSelectChange): void {
        const subjectData = event.value;
        if (subjectData === 'ALL') {
            this.hide = false;
            this.startText = false;
            this.testDetails = [];
            this.getTestInfoByGroup();
        } else {
            this.subjectID = subjectData.id;
            this.subjectName = subjectData.name;
            this.getTestInfo();
        }
    }
    getTestInfoByGroup() {
        this.startText = false;
        this.dataSource = new MatTableDataSource();
        this.profileSubscription = this.profileService
            .getTestDetails(this.groupId)
            .pipe(
                mergeMap((res: TestDetails[]) => {
                    if (res.length) {
                        this.testsBySubject = res;
                        this.subjectsIds = res.map((item) => item.subject_id);
                        this.modalService.showSnackBar('Тести завантажено');
                        return from(this.subjectsIds).pipe(
                            mergeMap((id) =>
                                this.profileService.getTestDate(id)
                            )
                        );
                    } else {
                        this.hide = false;
                        this.testsBySubject = [];
                        this.modalService.showSnackBar('Тести відсутні');
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: any) => {
                    const testDate = res[0] ? res[0] : res;
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
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                },
            });
    }
    getTestInfo(): void {
        this.startText = false;
        this.profileSubscription = this.profileService
            .getTestDate(this.subjectID)
            .pipe(
                concatMap((res: TestDetails[]) => {
                    if (res.length) {
                        this.testsBySubject = res;
                        this.modalService.showSnackBar('Тести завантажено');
                        return this.profileService.getTestDetails(this.groupId);
                    } else {
                        this.hide = false;
                        this.testsBySubject = [];
                        this.modalService.showSnackBar('Тести відсутні');
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: TestDate) => {
                    let testDate = res[0] ? res[0] : res;
                    if (testDate.response === 'no records') {
                        testDate = {
                            end_date: 'Дані відсутні',
                            start_date: 'Дані відсутні',
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
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                },
            });
    }

    checkPossibilityToPassTest(test: TestDetails): void {
        this.profileSubscription = this.profileService
            .testPlayerGetTest(test.test_id)
            .subscribe(
                () => {
                    this.startTest(test);
                },
                (error: Response) => {
                    this.errorHandler(
                        error,
                        'Попередження',
                        this.checkCurrentDate(test)
                    );
                }
            );
    }

    checkCurrentDate(test: TestDate | any): string {
        const startDate = new Date(`${test.start_date}`);
        const startDateWithTime = new Date(
            `${test.start_date} ${test.start_time}`
        );
        const endDate = new Date(`${test.end_date} ${test.end_time}`);
        if (this.currentDate >= startDate && this.currentDate <= endDate) {
            return `Ви не можете здавати цей екзамен! Екзамен буде доступний сьогодні о ${test.start_time}`;
        } else if (
            this.currentDate > startDateWithTime &&
            this.currentDate > endDate
        ) {
            return `Ви не можете здавати цей екзамен! Екзамен більше не доступний`;
        } else if (
            this.currentDate < startDateWithTime &&
            this.currentDate < endDate
        ) {
            return `Ви не можете здавати цей екзамен! Екзамен буде доступний ${test.start_date} о ${test.start_time}`;
        } else {
            return `Екзамен не доступний! Немає потрібних даних`;
        }
    }

    startTest(test: TestDetails): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'school',
                    message: `Розпочати тест ${test.test_name} з предмету ${test.subjectname}?
                    Тривалість тесту ${test.time_for_test} та ${test.attempts} спроби на здачу ${test.tasks} завдань!`,
                },
            },
            (result: DialogResult) => {
                if (result) {
                    const navigationExtras: NavigationExtras = {
                        state: test,
                    };
                    this.router.navigate(
                        ['student/test-player', test.test_id],
                        navigationExtras
                    );
                } else if (!result) {
                    this.modalService.showSnackBar('Скасовано');
                }
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
    getSubName(id: string) {
        const currentSpec = this.subjects.filter(
            (item) => item.subject_id === id
        );
        return currentSpec[0].subject_name;
    }
    getNewSubjects(res) {
        res.forEach((elem) => {
            const newElem = this.subjects.filter(
                (item) => elem.subject_id === item.subject_id
            );
            this.newSubjects.push(newElem[0]);
        });
    }
    ngOnDestroy(): void {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
