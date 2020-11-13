import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { StudentsService } from '../../../shared/services/students/students.service'
import { Student } from '../../../shared/interfaces/students/interfaces'

@Component({
    selector: 'app-students-modal',
    templateUrl: './students-modal.component.html',
    styleUrls: ['./students-modal.component.scss'],
})
export class StudentsModalComponent implements OnInit {
    form: FormGroup
    submitted = false

    constructor(
        public dialogRef: MatDialogRef<StudentsModalComponent>,
        private studentsService: StudentsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.initForm()
    }

    initForm(): void {
        this.form = new FormGroup({
            lastname: new FormControl(
                this.data.student_data
                    ? this.data.student_data.student_surname
                    : '',
                [Validators.required]
            ),
            firstname: new FormControl(
                this.data.student_data
                    ? this.data.student_data.student_name
                    : '',
                [Validators.required]
            ),
            fathername: new FormControl(
                this.data.student_data
                    ? this.data.student_data.student_fname
                    : '',
                [Validators.required]
            ),
            gradebookID: new FormControl(
                this.data.student_data
                    ? this.data.student_data.gradebook_id
                    : '',
                [Validators.required]
            ),
            username: new FormControl(
                this.data.student_data ? this.data.student_data.username : '',
                [Validators.required]
            ),
            email: new FormControl(
                this.data.student_data ? this.data.student_data.email : '',
                [Validators.required, Validators.email]
            ),
            password: new FormControl(
                this.data.student_data
                    ? this.data.student_data.plain_password
                    : '',
                [Validators.required, Validators.minLength(8)]
            ),
            password_confirm: new FormControl(
                this.data.student_data
                    ? this.data.student_data.plain_password
                    : '',
                [Validators.required]
            ),
        })
    }

    submit(): void {
        if (this.form.invalid) {
            return
        }

        this.form.disable()
        this.submitted = true

        const newStudent: Student = {
            email: this.form.value.email,
            username: this.form.value.username,
            password: this.form.value.password,
            password_confirm: this.form.value.password_confirm,
            gradebook_id: this.form.value.gradebookID,
            student_surname: this.form.value.lastname,
            student_name: this.form.value.firstname,
            student_fname: this.form.value.fathername,
            group_id: 1,
            photo: '',
            plain_password: this.form.value.password,
        }

        if (this.data.isUpdateData) {
            this.studentsService
                .update(this.data.student_data.user_id, newStudent)
                .subscribe(() => {
                    this.form.enable()
                    this.dialogRef.close()
                })
        } else {
            this.studentsService.create(newStudent).subscribe(() => {
                this.form.enable()
                this.dialogRef.close()
            })
        }
    }

    closeModal(): void {
        this.dialogRef.close()
    }
}
