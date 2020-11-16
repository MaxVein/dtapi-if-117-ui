import { Component, OnInit } from '@angular/core'

import {
    isLoggedRes,
    studentDetails,
    groupDetails,
    facultyDetails,
    specialityDetails,
    subjectDetails,
} from './interfaces/studentInterfaces'
import { StudentService } from './services/student.service'
import { AuthService } from '../login/services/auth.service'

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
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

    private studentId: string
    private groupId: string
    private facultyId: string
    private specialityId: string
    private subjectId: string

    ngOnInit(): void {
        this.auth.isLogged().subscribe((res: isLoggedRes) => {
            this.studentId = res.id
            this.getAllData()
        })
    }
    getStudentInfo() {
        this.student
            .getRecords('Student', this.studentId)
            .subscribe((res: studentDetails) => {
                this.studentName = res.student_name
                this.studentSurname = res.student_surname
                this.studentFname = res.student_fname
                this.photo = res.photo
                this.groupId = res.group_id
                console.log(`student`, res)
                this.getStudentDetails()
            })
    }
    getStudentDetails() {
        this.student
            .getRecords('Group', this.groupId)
            .subscribe((res: groupDetails) => {
                this.facultyId = res.faculty_id
                this.groupName = res.group_name
                this.specialityId = res.speciality_id
                console.log(`group`, res)
                this.getFaculty()
                this.getSpeciality()
                this.getTestDetails()
            })
    }
    getTestDetails() {
        this.student.getRecords('Subject').subscribe((res: subjectDetails) => {
            this.subjectId = res.subject_id
            console.log(`subject`, res)
            this.student.getTestDate(this.subjectId).subscribe((res) => {
                console.log(`Date`, res)
                this.student
                    .getTestDetails(this.groupId, this.subjectId)
                    .subscribe((res) => {
                        console.log(`details`, res)
                    })
            })
        })
    }
    getSpeciality() {
        this.student
            .getRecords('Speciality', this.specialityId)
            .subscribe((res: specialityDetails) => {
                this.specialityCode = res.speciality_code
                this.specialityName = res.speciality_name
                console.log(`Speciality`, res)
            })
    }

    getFaculty() {
        this.student
            .getRecords('Faculty', this.facultyId)
            .subscribe((res: facultyDetails) => {
                this.facultyName = res.faculty_name
                console.log(`faculty`, res)
            })
    }

    getAllData() {
        this.getStudentInfo()
    }
}
