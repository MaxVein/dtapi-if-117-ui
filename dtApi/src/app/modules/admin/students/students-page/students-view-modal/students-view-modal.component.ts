import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { environment } from 'src/environments/environment'
import { Student } from 'src/app/shared/interfaces/interfaces'

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

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsViewModalComponent>,
        private studentsService: StudentsService
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentInfo()
    }

    getStudentInfo(): void {
        this.studentsService
            .getById(this.student.user_id)
            .subscribe((response) => {
                this.student.username = response[0].username
                this.student.email = response[0].email
                this.loading = false
            })
    }

    closeModal(): void {
        this.dialogRef.close('Закрито')
    }
}
