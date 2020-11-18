import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'

import { concatMap, map } from 'rxjs/operators'
import { Observable } from 'rxjs'

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
} from './interfaces/student-profileInterfaces'
import { StudentService } from './services/student-profile.service'
import { AuthService } from '../login/services/auth.service'

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./student-profile.component.scss'],
})
export class StudentProfileComponent implements OnInit {
    constructor(private student: StudentService, private auth: AuthService) {}

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
        this.auth.isLogged().subscribe((res: isLoggedRes) => {
            this.studentId = res.id
            this.getSubject()
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
                        console.log(`student`, this.groupId)
                        return this.student.getRecords('Group', this.groupId)
                    }
                ),
                map((res) => {
                    return res[0]
                })
            )
            .subscribe((res: groupDetails) => {
                this.facultyId = res.faculty_id
                this.groupName = res.group_name
                this.specialityId = res.speciality_id
                this.getFaculty()
                this.getSpeciality()
                this.getTestDetails(this.subjectId)
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
    getSubject() {
        this.student
            .getRecords('Subject')
            .subscribe((res: subjectDetails[]) => {
                this.subjects = res
                this.subjectId = res[0].subject_id
                this.subjectName = res[0].subject_name
                console.log(this.subjectId)
            })
    }
    getTestDetails(id: string) {
        this.student
            .getTestDate(id)
            .pipe(
                concatMap(
                    (res: testDetails[]): Observable<any> => {
                        this.testsBySubject = res
                        return this.student.getTestDetails(this.subjectId)
                    }
                )
            )
            .subscribe((res: testDate[]) => {
                console.log(res)

                this.testDetails = [...this.testsBySubject].map((test) => ({
                    ...test,
                    ...res[0],
                    subjectname: this.subjectName,
                }))
                this.dataSource = new MatTableDataSource(this.testDetails)
                this.dataSource.paginator = this.paginator
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
        this.getTestDetails(this.subjectId)
        console.log(event)
    }
}
