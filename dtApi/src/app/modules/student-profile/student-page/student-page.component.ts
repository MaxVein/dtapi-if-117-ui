import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSnackBar } from '@angular/material/snack-bar'

import { concatMap, map } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'

import { environment } from 'src/environments/environment'
import {
    isLoggedRes,
    studentDetails,
    groupDetails,
    facultyDetails,
    specialityDetails,
    subjectDetails,
    testDetails,
    testDate,
} from './interfaces/student-pageInterfaces'
import { StudentService } from './services/student-page.service'
import { AuthService } from '../../login/services/auth.service'
import { Router } from '@angular/router'

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
        private router: Router
    ) {}

    photo: string
    gradebookId: string
    studentFname: string
    studentName: string
    studentSurname: string
    groupName: string
    facultyName: string
    specialityCode: string
    specialityName: string
    testsBySubject: testDetails[]
    subjectName: string
    subjects: subjectDetails[]
    testDetails
    dataSource
    displayedColumns: string[] = [
        'Предмет',
        'Тест',
        'Початок',
        'Кінець',
        'Кількість завдань',
        'Тривалість тесту',
        'Кількість спроб',
        'Почати тестування',
    ]
    defaultImage: string = environment.defaultImage

    private studentId: string
    private groupId: string
    private facultyId: string
    private specialityId: string
    private subjectId: string

    @ViewChild(MatPaginator) paginator: MatPaginator

    ngOnInit(): void {
        this.auth
            .isLogged()
            .pipe(
                concatMap(
                    (res: isLoggedRes): Observable<any> => {
                        this.studentId = res.id
                        return this.student.getRecords('Subject')
                    }
                )
            )
            .subscribe((res: subjectDetails[]) => {
                this.subjects = res
                this.subjectId = res[0].subject_id
                this.subjectName = res[0].subject_name
                this.getAllData()
            })
    }

    getStudentInfo() {
        this.student
            .getRecords('Student', this.studentId)
            .pipe(
                map((res) => {
                    return res[0]
                }),
                concatMap(
                    (res: studentDetails): Observable<any> => {
                        this.studentName = res.student_name
                        this.studentSurname = res.student_surname
                        this.studentFname = res.student_fname
                        this.photo = res.photo ? res.photo : this.defaultImage
                        this.groupId = res.group_id
                        this.gradebookId = res.gradebook_id
                        return this.student.getRecords('Group', this.groupId)
                    }
                ),
                map((res) => res[0])
            )
            .subscribe((res: groupDetails) => {
                this.facultyId = res.faculty_id
                this.groupName = res.group_name
                this.specialityId = res.speciality_id
                this.getFaculty()
                this.getSpeciality()
                this.getTestInfo()
            })
    }

    getSpeciality() {
        this.student
            .getRecords('Speciality', this.specialityId)
            .pipe(map((res) => res[0]))
            .subscribe((res: specialityDetails) => {
                this.specialityCode = res.speciality_code
                this.specialityName = res.speciality_name
            })
    }

    getFaculty() {
        this.student
            .getRecords('Faculty', this.facultyId)
            .pipe(map((res) => res[0]))
            .subscribe((res: facultyDetails) => {
                this.facultyName = res.faculty_name
            })
    }

    getTestInfo() {
        this.student
            .getTestDate(this.subjectId)
            .pipe(
                concatMap(
                    (res: testDetails[]): Observable<any> => {
                        this.testsBySubject = res
                        if (!Array.isArray(res)) {
                            this.openSnackBar('Дані відсутні', 'X')
                            return throwError(new Error('No data found...'))
                        } else {
                            return this.student.getTestDetails(this.subjectId)
                        }
                    }
                ),
                map((res) => res[0])
            )
            .subscribe({
                next: (res: testDate) => {
                    let testDate = res
                    if (testDate === undefined) {
                        testDate = {
                            end_date: 'Дані відсутні',
                            start_date: 'Дані відсутні',
                        }
                    }
                    this.testDetails = [...this.testsBySubject].map((test) => ({
                        ...test,
                        ...testDate,
                        subjectname: this.subjectName,
                    }))
                    this.dataSource = new MatTableDataSource(this.testDetails)
                    this.dataSource.paginator = this.paginator
                },
                error: (err) => {
                    this.dataSource = null
                },
            })
    }

    getAllData() {
        this.getStudentInfo()
    }

    selectSubject(event) {
        this.subjectId =
            event.currentTarget.options[
                event.currentTarget.options.selectedIndex
            ].id
        this.subjectName = event.target.value
        this.getTestInfo()
    }
    logOut() {
        this.auth.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login'])
            },
        })
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        })
    }
}
