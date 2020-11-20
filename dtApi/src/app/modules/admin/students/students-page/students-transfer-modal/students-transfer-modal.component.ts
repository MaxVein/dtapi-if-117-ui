import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSelectChange } from '@angular/material/select'
import { AlertComponent } from 'src/app/shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { ModalService } from 'src/app/shared/services/modal.service'
import { Faculty, Group, Student } from 'src/app/shared/interfaces/interfaces'

@Component({
    selector: 'app-students-transfer-modal',
    templateUrl: './students-transfer-modal.component.html',
    styleUrls: ['./students-transfer-modal.component.scss'],
})
export class StudentsTransferModalComponent implements OnInit {
    loading = false
    student: Student = this.data.student_data
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
        this.studentsService.getById(this.student.user_id).subscribe(
            (response) => {
                this.student.username = response[0].username
                this.student.email = response[0].email
                this.loading = false
            },
            () => {
                const message = 'Сталася помилка. Спробуйте знову'
                const title = 'Помилка'
                this.closeModal('Закрито через помилку')
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
        this.studentsService.getEntityFaculty().subscribe(
            (response) => {
                this.faculties = response
            },
            () => {
                const message = 'Сталася помилка. Спробуйте знову'
                const title = 'Помилка'
                this.closeModal('Закрито через помилку')
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
        this.studentsService.getEntityGroupsByFaculty(facultyID).subscribe(
            (response) => {
                this.groups = response
            },
            () => {
                const message = 'Сталася помилка. Спробуйте знову'
                const title = 'Помилка'
                this.closeModal('Закрито через помилку')
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
        const newStudent = Object.assign({}, this.data.student_data)
        newStudent.group_id = this.selectedGroupID
        this.studentsService
            .update(this.data.student_data.user_id, newStudent)
            .subscribe(
                (response) => {
                    this.dialogRef.close(response)
                },
                (error) => {
                    this.dialogRef.close(error)
                }
            )
    }

    closeModal(dialogResult = 'Скасовано'): void {
        this.dialogRef.close(dialogResult)
    }
}
