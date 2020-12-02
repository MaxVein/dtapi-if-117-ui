import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { concatMap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import {
    isLoggedRes,
    studentDetails,
    groupDetails,
    facultyDetails,
    specialityDetails,
    subjectDetails,
    testDetails,
    testDate,
} from './student-page.interfaces';
import { StudentService } from './student-page.service';
import { AuthService } from '../../login/auth.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
    selector: 'app-student-page',
    templateUrl: './student-page.component.html',
    styleUrls: ['./student-page.component.scss'],
})
export class StudentPageComponent implements OnInit {
    constructor(
        private student: StudentService,
        private auth: AuthService,
        private snackBar: MatSnackBar,
        private router: Router,
        public dialog: MatDialog
    ) {}

    photo: string;
    gradebookId: string;
    studentFname: string;
    studentName: string;
    studentSurname: string;
    groupName: string;
    facultyName: string;
    specialityCode: string;
    specialityName: string;
    testsBySubject: testDetails[];
    subjectName: string;
    subjects: subjectDetails[];
    testDetails;
    dataSource;
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
    defaultImage: string = environment.defaultImage;
    errorMessage = 'Дані відсутні';
    closeButton = 'X';
    dialogTitle = 'Alert';

    private studentId: string;
    private groupId: string;
    private facultyId: string;
    private specialityId: string;
    private subjectId: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(): void {
        this.auth
            .isLogged()
            .pipe(
                concatMap(
                    (res: isLoggedRes): Observable<any> => {
                        this.studentId = res.id;
                        return this.student.getRecords('Subject');
                    }
                )
            )
            .subscribe((res: subjectDetails[]) => {
                this.subjects = res;
                this.subjectId = res[0].subject_id;
                this.subjectName = res[0].subject_name;
                this.getStudentInfo();
            });
    }

    getStudentInfo() {
        this.student
            .getRecords('Student', this.studentId)
            .pipe(
                map((res) => {
                    return res[0];
                }),
                concatMap(
                    (res: studentDetails): Observable<any> => {
                        this.studentName = res.student_name;
                        this.studentSurname = res.student_surname;
                        this.studentFname = res.student_fname;
                        this.photo = res.photo ? res.photo : this.defaultImage;
                        this.groupId = res.group_id;
                        this.gradebookId = res.gradebook_id;
                        return this.student.getRecords('Group', this.groupId);
                    }
                ),
                map((res) => res[0])
            )
            .subscribe((res: groupDetails) => {
                this.facultyId = res.faculty_id;
                this.groupName = res.group_name;
                this.specialityId = res.speciality_id;
                this.getFaculty(res.faculty_id);
                this.getSpeciality(res.speciality_id);
                this.getTestInfo();
            });
    }

    getSpeciality(specialityId: string) {
        this.student
            .getRecords('Speciality', specialityId)
            .pipe(map((res) => res[0]))
            .subscribe((res: specialityDetails) => {
                this.specialityCode = res.speciality_code;
                this.specialityName = res.speciality_name;
            });
    }

    getFaculty(facultyId: string) {
        this.student
            .getRecords('Faculty', facultyId)
            .pipe(map((res) => res[0]))
            .subscribe((res: facultyDetails) => {
                this.facultyName = res.faculty_name;
            });
    }

    getTestInfo() {
        this.student
            .getTestBySubject(this.subjectId)
            .pipe(
                concatMap(
                    (res: testDetails[]): Observable<any> => {
                        this.testsBySubject = res;
                        if (!res[0]) {
                            this.openSnackBar(
                                this.errorMessage,
                                this.closeButton
                            );
                            return throwError(new Error(this.errorMessage));
                        }
                        return this.student.getTestDetails(
                            this.groupId,
                            this.subjectId
                        );
                    }
                )
            )
            .subscribe({
                next: (res: testDate) => {
                    let testDate = res[0] ? res[0] : res;
                    if (testDate.response === 'no records') {
                        testDate = {
                            end_date: this.errorMessage,
                            start_date: this.errorMessage,
                        };
                    }
                    this.testDetails = this.testsBySubject.map((test) => ({
                        ...test,
                        ...testDate,
                        subjectname: this.subjectName,
                    }));
                    this.dataSource = new MatTableDataSource(this.testDetails);
                    this.dataSource.paginator = this.paginator;
                },
                error: () => {
                    this.dataSource = null;
                },
            });
    }

    selectSubject(event) {
        this.subjectId =
            event.currentTarget.options[
                event.currentTarget.options.selectedIndex
            ].id;
        this.subjectName = event.target.value;
        this.getTestInfo();
    }
    logOut() {
        this.auth.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
        });
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    checkTest(event) {
        const testId = event.target.id;
        const isTest$ = this.student.checkPosibilityOfTest(
            this.studentId,
            testId
        );
        isTest$.subscribe({
            // next: (res) => console.log(res),
            error: (err) =>
                this.openDialog(this.dialogTitle, err.error.response),
        });
    }
    openDialog(title: string, message: string): void {
        this.dialog.open(AlertComponent, {
            data: { title, message },
        });
    }
}
