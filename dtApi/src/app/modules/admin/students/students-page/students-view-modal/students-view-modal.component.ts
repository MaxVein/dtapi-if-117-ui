import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AlertComponent } from '../../../../../shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students.service'
import { ModalService } from '../../../../../shared/services/modal.service'
import { Subscription } from 'rxjs'
import { Student } from 'src/app/shared/interfaces/interfaces'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-students-view-modal',
    templateUrl: './students-view-modal.component.html',
    styleUrls: ['./students-view-modal.component.scss'],
})
export class StudentsViewModalComponent implements OnInit, OnDestroy {
    loading = false
    defaultImage = environment.defaultImage
    student: Student = this.data.student_data
    studentSubscription: Subscription
    groupName: string
    facultyName: string
    specialityName: string

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsViewModalComponent>,
        private studentsService: StudentsService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentInfo()
        this.getGroupInfo()
    }

    getStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById(this.student.user_id)
            .subscribe(
                (response) => {
                    this.student.username = response[0].username
                    this.student.email = response[0].email
                    this.getStudentPhoto()
                },
                () => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.closeModal(title)
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                        },
                    })
                }
            )
    }

    getStudentPhoto(): void {
        this.studentSubscription = this.studentsService
            .getByGroup(this.student.group_id, false)
            .subscribe(
                (response) => {
                    const index = response.findIndex(
                        (s) => s.user_id === this.student.user_id
                    )
                    const currentStudent = response[index]
                    const student = Object.assign(this.student, currentStudent)
                    this.student = student
                    this.loading = false
                },
                () => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.loading = false
                    this.closeModal(title)
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                        },
                    })
                }
            )
    }

    getGroupInfo(): void {
        this.studentSubscription = this.studentsService
            .getGroupData(this.student.group_id)
            .subscribe(
                (response) => {
                    this.groupName = response[0].group_name
                    this.getFacultyInfo(response[0].faculty_id)
                    this.getSpecialityInfo(response[0].speciality_id)
                },
                () => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.closeModal(title)
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                        },
                    })
                }
            )
    }

    getFacultyInfo(id: string): void {
        this.studentSubscription = this.studentsService
            .getFacultyData(id)
            .subscribe(
                (response) => {
                    this.facultyName = response[0].faculty_name
                },
                () => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.closeModal(title)
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                        },
                    })
                }
            )
    }

    getSpecialityInfo(id: string): void {
        this.studentSubscription = this.studentsService
            .getSpecialityData(id)
            .subscribe(
                (response) => {
                    this.specialityName = response[0].speciality_name
                },
                () => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.closeModal(title)
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                        },
                    })
                }
            )
    }

    closeModal(dialogResult: any = 'Закрито'): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
