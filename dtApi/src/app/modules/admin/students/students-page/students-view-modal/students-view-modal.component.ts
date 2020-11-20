import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AlertComponent } from '../../../../../shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { ModalService } from '../../../../../shared/services/modal.service'
import { Student } from 'src/app/shared/interfaces/interfaces'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-students-view-modal',
    templateUrl: './students-view-modal.component.html',
    styleUrls: ['./students-view-modal.component.scss'],
})
export class StudentsViewModalComponent implements OnInit {
    loading = false
    defaultImage = environment.defaultImage
    groupID = this.data.group_id
    student: Student = this.data.student_data
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
        this.studentsService
            .getById(this.student.user_id)
            .subscribe((response) => {
                this.student.username = response[0].username
                this.student.email = response[0].email
            })
    }

    getGroupInfo(): void {
        this.studentsService.getGroupData(this.groupID).subscribe(
            (response) => {
                this.groupName = response[0].group_name
                this.getFacultyInfo(response[0].faculty_id)
                this.getSpecialityInfo(response[0].speciality_id)
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

    getFacultyInfo(id: string): void {
        this.studentsService.getFacultyData(id).subscribe(
            (response) => {
                this.facultyName = response[0].faculty_name
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

    getSpecialityInfo(id: string): void {
        this.studentsService.getSpecialityData(id).subscribe(
            (response) => {
                this.specialityName = response[0].speciality_name
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

    closeModal(dialogResult = 'Закрито'): void {
        this.dialogRef.close(dialogResult)
    }
}
