import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import {
    AsyncValidatorFn,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AlertComponent } from '../../../../../shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students.service'
import { ModalService } from '../../../../../shared/services/modal.service'
import { Observable, of, Subscription } from 'rxjs'
import { Student } from 'src/app/shared/interfaces/interfaces'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-students-modal',
    templateUrl: './students-modal.component.html',
    styleUrls: ['./students-modal.component.scss'],
})
export class StudentsModalComponent implements OnInit, OnDestroy {
    form: FormGroup
    loading = false
    submitted = false
    hide = true
    image: string | ArrayBuffer = ''
    defaultImage = environment.defaultImage
    student: Student = this.data.student_data
    studentSubscription: Subscription

    @ViewChild('imageFile') inputRef: ElementRef

    constructor(
        public dialogRef: MatDialogRef<StudentsModalComponent>,
        private studentsService: StudentsService,
        private modalService: ModalService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.loading = true
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
                {
                    validators: [Validators.required],
                    updateOn: 'blur',
                    asyncValidators: [
                        this.uniqueValidator(
                            'Student',
                            'checkGradebookID',
                            'gradebook_id'
                        ),
                    ],
                }
            ),
            username: new FormControl(null, {
                validators: [Validators.required],
                updateOn: 'blur',
                asyncValidators: [
                    this.uniqueValidator(
                        'AdminUser',
                        'checkUserName',
                        'username'
                    ),
                ],
            }),
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur',
                asyncValidators: [
                    this.uniqueValidator(
                        'AdminUser',
                        'checkEmailAddress',
                        'email'
                    ),
                ],
            }),
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
            this.studentSubscription = this.studentsService
                .getById(studentID)
                .subscribe(
                    (response) => {
                        this.student.username = response[0].username
                        this.student.email = response[0].email
                        this.form.get('username').setValue(response[0].username)
                        this.form.get('email').setValue(response[0].email)
                        this.getStudentPhoto(studentID)
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
        } else {
            setTimeout(() => {
                this.loading = false
            }, 300)
        }
    }

    getStudentPhoto(id: string): void {
        this.studentSubscription = this.studentsService
            .getByGroup(this.student.group_id, false)
            .subscribe(
                (response) => {
                    const index = response.findIndex((s) => s.user_id === id)
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

    uniqueValidator(entity, method, check): AsyncValidatorFn {
        return (
            control: FormControl
        ):
            | Promise<ValidationErrors | null>
            | Observable<ValidationErrors | null> => {
            if (this.student && this.student[check] === control.value) {
                return of(null)
            } else {
                return this.studentsService.check(entity, method, control.value)
            }
        }
    }

    submit(): void {
        if (this.form.invalid) {
            return
        }

        this.form.disable()
        this.submitted = true
        this.loading = true

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

        if (this.image === '' && this.data.isUpdateData) {
            newStudent.photo = this.student.photo
        }

        if (this.data.isUpdateData) {
            this.studentSubscription = this.studentsService
                .update(this.student.user_id, newStudent)
                .subscribe(
                    (data) => {
                        this.loading = false
                        this.form.enable()
                        const student = Object.assign(data, newStudent)
                        student.user_id = this.student.user_id
                        this.closeModal(student)
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
        } else {
            this.studentSubscription = this.studentsService
                .create(newStudent)
                .subscribe(
                    (data) => {
                        this.loading = false
                        this.form.enable()
                        const student = Object.assign(data, newStudent)
                        this.closeModal(student)
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

    closeModal(dialogResult: any = 'Скасовано'): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
