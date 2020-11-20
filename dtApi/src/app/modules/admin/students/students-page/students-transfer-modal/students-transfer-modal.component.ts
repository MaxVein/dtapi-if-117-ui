import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSelectChange } from '@angular/material/select'
import { AlertComponent } from 'src/app/shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { ModalService } from 'src/app/shared/services/modal.service'
import { Faculty, Group, Student } from 'src/app/shared/interfaces/interfaces'
import { Subscription } from 'rxjs'

@Component({
    selector: 'app-students-transfer-modal',
    templateUrl: './students-transfer-modal.component.html',
    styleUrls: ['./students-transfer-modal.component.scss'],
})
export class StudentsTransferModalComponent implements OnInit, OnDestroy {
    loading = false
    student: Student = this.data.student_data
    studentSubscription: Subscription
    faculties: Faculty[] = []
    groups: Group[] = []
    selectedGroupID: string
    submitted = false

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsTransferModalComponent>,
        private studentsService: StudentsService,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentInfo()
        this.getFacultyList()
    }

    getStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById(this.student.user_id)
            .subscribe(
                (response) => {
                    this.student.username = response[0].username
                    this.student.email = response[0].email
                    this.loading = false
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

    getFacultyList(): void {
        this.studentSubscription = this.studentsService
            .getEntityFaculty()
            .subscribe(
                (response) => {
                    this.faculties = response
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

    getGroups(event: MatSelectChange): void {
        const facultyID = event.value
        this.studentSubscription = this.studentsService
            .getEntityGroupsByFaculty(facultyID)
            .subscribe(
                (response) => {
                    this.groups = response
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

    getGroup(event: MatSelectChange): void {
        this.selectedGroupID = event.value
        this.submitted = true
    }

    submit(): void {
        this.loading = true
        const newStudent = Object.assign({}, this.data.student_data)
        newStudent.group_id = this.selectedGroupID
        this.studentSubscription = this.studentsService
            .update(this.data.student_data.user_id, newStudent)
            .subscribe(
                (response) => {
                    this.loading = false
                    this.dialogRef.close(response)
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

    closeModal(dialogResult = 'Скасовано'): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
