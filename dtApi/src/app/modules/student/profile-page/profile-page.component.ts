import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { AuthService } from '../../login/auth.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logged } from '../../../shared/interfaces/auth.interfaces';
import {
    Faculty,
    Group,
    Speciality,
    Student,
    Subject,
} from '../../../shared/interfaces/entity.interfaces';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = false;
    student: Student;
    groupName: string;
    facultyName: string;
    specialityName: string;
    specialityCode: string;
    subjects: Subject[] = [];
    firstSubject: Subject;
    studentSubscription: Subscription;

    constructor(
        private studentService: StudentService,
        private auth: AuthService,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.isLogged();
        this.getSubjectInfo();
    }

    isLogged(): void {
        this.studentSubscription = this.auth.isLogged().subscribe(
            (response: Logged) => {
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
                    if (response) {
                        this.student = response;
                        this.modalService.showSnackBar(
                            `Ласкаво просимо ${response.student_surname} ${response.student_name} ${response.student_fname}`
                        );
                        this.getGroupInfo();
                    } else {
                        this.student = null;
                        this.loading = false;
                        this.modalService.showSnackBar(
                            'Дані студента відсутні'
                        );
                    }
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
                    this.firstSubject = response[0];
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
                    this.loading = false;
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
