/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Student } from 'src/app/shared/interfaces/interfaces'
import { StudentsService } from 'src/app/modules/admin/students/students-page/students.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-students-modal',
    templateUrl: './students-modal.component.html',
    styleUrls: ['./students-modal.component.scss'],
})
export class StudentsModalComponent implements OnInit {
    form: FormGroup
    submitted = false
    hide = true
    image: string | ArrayBuffer = ''
    defaultImage = environment.defaultImage
    student: Student = this.data.student_data

    @ViewChild('imageFile') inputRef: ElementRef

    constructor(
        public dialogRef: MatDialogRef<StudentsModalComponent>,
        private studentsService: StudentsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.initForm()
        this.getStudentInfo()
    }

    initForm(): void {
        this.form = new FormGroup({
            lastname: new FormControl(
                this.student ? this.student.student_surname : '',
                [Validators.required]
            ),
            firstname: new FormControl(
                this.student ? this.student.student_name : '',
                [Validators.required]
            ),
            fathername: new FormControl(
                this.student ? this.student.student_fname : '',
                [Validators.required]
            ),
            gradebookID: new FormControl(
                this.student ? this.student.gradebook_id : '',
                [Validators.required]
            ),
            username: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(
                this.student ? this.student.plain_password : '',
                [Validators.required, Validators.minLength(8)]
            ),
            password_confirm: new FormControl(
                this.student ? this.student.plain_password : '',
                [Validators.required]
            ),
        })
    }

    getStudentInfo(): void {
        if (this.data.student_data) {
            const studentID = this.student.user_id
            this.studentsService.getById(studentID).subscribe((response) => {
                this.form.get('username').setValue(response[0].username)
                this.form.get('email').setValue(response[0].email)
            })
        }
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
            group_id: this.data.group_id,
            photo: this.image,
            plain_password: this.form.value.password,
        }

        if (this.image === '') {
            newStudent.photo = this.student.photo
        }

        if (this.data.isUpdateData) {
            this.studentsService
                .update(this.student.user_id, newStudent)
                .subscribe(
                    (data) => {
                        this.form.enable()
                        this.dialogRef.close(data)
                    },
                    (error) => this.dialogRef.close(error)
                )
        } else {
            this.studentsService.create(newStudent).subscribe(
                (data) => {
                    this.form.enable()
                    this.dialogRef.close(data)
                },
                (error) => this.dialogRef.close(error)
            )
        }
    }

    closeModal(): void {
        this.dialogRef.close('Скасовано')
    }

    fileInput(): void {
        this.inputRef.nativeElement.click()
    }

    fileUpload(event: any): void {
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            this.image = reader.result
        }
        reader.readAsDataURL(file)
    }
}
