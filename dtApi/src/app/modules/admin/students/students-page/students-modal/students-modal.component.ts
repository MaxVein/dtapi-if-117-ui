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
import {
    DialogResult,
    Response,
    Student,
    StudentInfo,
    ValidateStudentData,
} from 'src/app/shared/interfaces/interfaces'
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
    student: Student = this.data.STUDENT_DATA
    validateData: ValidateStudentData
    image: string | ArrayBuffer = ''
    defaultImage = environment.defaultImage
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
        if (this.data.IS_UPDATE_DATA) {
            this.studentSubscription = this.studentsService
                .getById('Student', this.student.user_id)
                .subscribe(
                    (response: Student[]) => {
                        this.student.photo = response[0].photo
                        this.getOtherStudentInfo()
                    },
                    (error: Response) => {
                        const message = 'Сталася помилка. Спробуйте знову'
                        const title = 'Помилка'
                        this.loading = false
                        this.closeModal({ message: title })
                        this.modalService.openModal(AlertComponent, {
                            data: {
                                message,
                                title,
                                error,
                            },
                        })
                    }
                )
        } else {
            setTimeout(() => {
                this.loading = false
            }, 200)
        }
    }

    getOtherStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById('AdminUser', this.student.user_id)
            .subscribe(
                (response: StudentInfo[]) => {
                    this.form.get('username').setValue(response[0].username)
                    this.form.get('email').setValue(response[0].email)
                    this.validateData = {
                        gradebook_id: this.student.gradebook_id,
                        username: response[0].username,
                        email: response[0].email,
                    }
                    this.loading = false
                },
                (error: Response) => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.loading = false
                    this.closeModal({ message: title })
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                            error,
                        },
                    })
                }
            )
    }

    uniqueValidator(
        entity: string,
        method: string,
        check: string
    ): AsyncValidatorFn {
        return (
            control: FormControl
        ):
            | Promise<ValidationErrors | null>
            | Observable<ValidationErrors | null> => {
            if (
                this.validateData &&
                this.validateData[check] === control.value
            ) {
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

        const formData: Student = {
            gradebook_id: this.form.value.gradebookID,
            student_surname: this.form.value.lastname,
            student_name: this.form.value.firstname,
            student_fname: this.form.value.fathername,
            group_id: this.data.GROUP_ID,
            photo: this.image,
            password: this.form.value.password,
            password_confirm: this.form.value.password_confirm,
            plain_password: this.form.value.password,
        }

        const studentInfo: StudentInfo = {
            email: this.form.value.email,
            username: this.form.value.username,
        }

        if (this.image === '' && this.data.IS_UPDATE_DATA) {
            formData.photo = this.student.photo
        }

        const newStudent = Object.assign({}, formData, studentInfo)

        if (this.data.IS_UPDATE_DATA) {
            this.studentSubscription = this.studentsService
                .update(this.student.user_id, newStudent)
                .subscribe(
                    (response: Response) => {
                        this.loading = false
                        this.form.enable()
                        this.closeModal({
                            message: response,
                            data: newStudent,
                            id: this.student.user_id,
                        })
                    },
                    (error: Response) => {
                        const message = 'Сталася помилка. Спробуйте знову'
                        const title = 'Помилка'
                        this.loading = false
                        this.closeModal({ message: title })
                        this.modalService.openModal(AlertComponent, {
                            data: {
                                message,
                                title,
                                error,
                            },
                        })
                    }
                )
        } else {
            this.studentSubscription = this.studentsService
                .create(newStudent)
                .subscribe(
                    (response: Response) => {
                        this.loading = false
                        this.form.enable()
                        this.closeModal({
                            message: response,
                            data: newStudent,
                            id: response.id,
                        })
                    },
                    (error: Response) => {
                        const message = 'Сталася помилка. Спробуйте знову'
                        const title = 'Помилка'
                        this.loading = false
                        this.closeModal({ message: title })
                        this.modalService.openModal(AlertComponent, {
                            data: {
                                message,
                                title,
                                error,
                            },
                        })
                    }
                )
        }
    }

    fileInput(): void {
        this.inputRef.nativeElement.click()
    }

    fileUpload(event: Event): void {
        const file: File = (event.target as HTMLInputElement).files[0]
        const reader: FileReader = new FileReader()
        reader.onload = () => {
            this.image = reader.result
        }
        reader.readAsDataURL(file)
    }

    closeModal(dialogResult: DialogResult = { message: 'Скасовано' }): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
