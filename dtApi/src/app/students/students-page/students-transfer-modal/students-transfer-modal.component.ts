import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { StudentsService } from '../../../shared/services/students/students.service'
import { ModalService } from '../../../shared/services/modal.service'
import { AlertComponent } from '../../../shared/components/alert/alert.component'
import { Student } from '../../../shared/interfaces/students/interfaces'

@Component({
    selector: 'app-students-transfer-modal',
    templateUrl: './students-transfer-modal.component.html',
    styleUrls: ['./students-transfer-modal.component.scss'],
})
export class StudentsTransferModalComponent implements OnInit {
    loading = false
    student: Student = this.data.student_data

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsTransferModalComponent>,
        private studentsService: StudentsService,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentInfo()
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
                this.modalService.openModal(AlertComponent, {
                    data: {
                        message,
                        title,
                    },
                })
            }
        )
    }

    closeModal(): void {
        this.dialogRef.close('Скасовано')
    }
}
