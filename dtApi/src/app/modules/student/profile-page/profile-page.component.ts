import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../login/auth.service';
import { StudentService } from '../services/student.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Subscription, throwError } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Logged } from '../../../shared/interfaces/auth.interfaces';
import {
    Faculty,
    Group,
    Response,
    Speciality,
    Student,
    Subject,
} from '../../../shared/interfaces/entity.interfaces';
import {
    TestDate,
    TestDetails,
} from '../../../shared/interfaces/student.interfaces';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-student-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = false;
    student: Student;
    defaultImage: string = environment.defaultImage;
    groupName: string;
    facultyName: string;
    specialityName: string;
    specialityCode: string;
    subjects: Subject[] = [];
    subjectID: string;
    subjectName: string;
    testsBySubject: TestDetails[];
    testDetails: TestDetails[];
    dataSource = new MatTableDataSource<TestDetails>();
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
    studentSubscription: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private studentService: StudentService,
        private auth: AuthService,
        public modalService: ModalService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.isLogged();
    }

    isLogged(): void {
        this.auth.isLogged().subscribe(
            (response: Logged) => {
                this.modalService.showSnackBar('Ласкаво просимо');
                this.getStudentInfo(response.id);
            },
            (error: Response) => {
                this.loading = false;
                this.errorHandler(
                    error,
                    'Помилка',
                    'Сталася помилка. Спробуйте знову'
                );
            }
        );
    }

    getStudentInfo(id: string): void {
        this.studentSubscription = this.studentService
            .getRecords('Student', id)
            .pipe(map((res) => res[0]))
            .subscribe(
                (response: Student) => {
                    this.student = response;
                    this.getGroupInfo();
                    this.getSubjectInfo();
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    getSubjectInfo(): void {
        this.studentSubscription = this.studentService
            .getRecords('Subject')
            .subscribe(
                (response: Subject[]) => {
                    this.subjects = response;
                    this.subjectID = response[0].subject_id;
                    this.subjectName = response[0].subject_name;
                    this.getTestInfo();
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    getGroupInfo(): void {
        this.studentSubscription = this.studentService
            .getRecords('Group', this.student.group_id)
            .pipe(map((res) => res[0]))
            .subscribe(
                (response: Group) => {
                    this.groupName = response.group_name;
                    this.getFacultyInfo(response.faculty_id);
                    this.getSpecialityInfo(response.speciality_id);
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    getSpecialityInfo(id: string): void {
        this.studentSubscription = this.studentService
            .getRecords('Speciality', id)
            .pipe(map((res) => res[0]))
            .subscribe(
                (response: Speciality) => {
                    this.specialityCode = response.speciality_code;
                    this.specialityName = response.speciality_name;
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    getFacultyInfo(id: string): void {
        this.studentSubscription = this.studentService
            .getRecords('Faculty', id)
            .pipe(map((res) => res[0]))
            .subscribe(
                (response: Faculty) => {
                    this.facultyName = response.faculty_name;
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    getTestInfo(): void {
        this.studentSubscription = this.studentService
            .getTestDate(this.subjectID)
            .pipe(
                concatMap((res: TestDetails[]) => {
                    if (!res[0]) {
                        return throwError(new Error());
                    } else {
                        this.testsBySubject = res;
                        return this.studentService.getTestDetails(
                            this.subjectID
                        );
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
                    this.loading = false;
                    this.dataSource = new MatTableDataSource(this.testDetails);
                    this.dataSource.paginator = this.paginator;
                },
                error: (error: Response) => {
                    this.dataSource = null;
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message: 'Дані відсутні',
                            title: 'Увага',
                        },
                    });
                },
            });
    }

    selectSubject(event: any): void {
        this.subjectID =
            event.currentTarget.options[
                event.currentTarget.options.selectedIndex
            ].id;
        this.subjectName = event.target.value;
        this.getTestInfo();
    }

    startTest(): void {
        this.router.navigate(['student/test-player']);
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
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
