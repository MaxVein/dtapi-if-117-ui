import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AsyncValidatorFn,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { StudentsService } from 'src/app/modules/admin/students/students.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { Observable, of, Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Student,
    StudentInfo,
    ValidateStudentData,
} from 'src/app/shared/interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-students-modal',
    templateUrl: './students-modal.component.html',
    styleUrls: ['./students-modal.component.scss'],
})
export class StudentsModalComponent implements OnInit, OnDestroy {
    form: FormGroup;
    loading = false;
    submitted = false;
    hide = true;
    student: Student = this.data.studentData;
    validateData: ValidateStudentData;
    image: string | ArrayBuffer = '';
    defaultImage = environment.defaultImage;
    studentSubscription: Subscription;

    @ViewChild('imageFile') inputRef: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<StudentsModalComponent>,
        private studentsService: StudentsService,
        private modalService: ModalService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            lastname: [
                this.student ? this.student.student_surname : '',
                [Validators.required],
            ],
            firstname: [
                this.student ? this.student.student_name : '',
                [Validators.required],
            ],
            fathername: [
                this.student ? this.student.student_fname : '',
                [Validators.required],
            ],
            gradebookID: [
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
                },
            ],
            username: [
                null,
                {
                    validators: [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.pattern(
                            '^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$'
                        ),
                    ],
                    updateOn: 'blur',
                    asyncValidators: [
                        this.uniqueValidator(
                            'AdminUser',
                            'checkUserName',
                            'username'
                        ),
                    ],
                },
            ],
            email: [
                null,
                {
                    validators: [
                        Validators.required,
                        Validators.email,
                        Validators.pattern(
                            '[a-zA-Z0-9._]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}'
                        ),
                    ],
                    updateOn: 'blur',
                    asyncValidators: [
                        this.uniqueValidator(
                            'AdminUser',
                            'checkEmailAddress',
                            'email'
                        ),
                    ],
                },
            ],
            password: [
                this.student ? this.student.plain_password : '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(
                        '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'
                    ),
                ],
            ],
            password_confirm: [
                this.student ? this.student.plain_password : '',
                [Validators.required],
            ],
        });
        this.getStudentInfo();
    }

    getStudentInfo(): void {
        this.loading = false;
        if (this.data.isUpdateData) {
            this.loading = true;
            this.studentSubscription = this.studentsService
                .getById('Student', this.student.user_id)
                .subscribe(
                    (response: Student[]) => {
                        this.student.photo = response[0].photo;
                        this.getOtherStudentInfo();
                    },
                    (error: Response) => {
                        this.loading = false;
                        this.closeModal({ message: 'Помилка' });
                        this.errorHandler(
                            error,
                            'Помилка',
                            'Сталася помилка. Спробуйте знову'
                        );
                    }
                );
        }
    }

    getOtherStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById('AdminUser', this.student.user_id)
            .subscribe(
                (response: StudentInfo[]) => {
                    this.form.get('username').setValue(response[0].username);
                    this.form.get('email').setValue(response[0].email);
                    this.validateData = {
                        gradebook_id: this.student.gradebook_id,
                        username: response[0].username,
                        email: response[0].email,
                    };
                    this.loading = false;
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: 'Помилка' });
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
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
                return of(null);
            } else {
                return this.studentsService.check(
                    entity,
                    method,
                    control.value
                );
            }
        };
    }

    studentData(): Student {
        const formData: Student = {
            gradebook_id: this.form.value.gradebookID,
            student_surname: this.form.value.lastname,
            student_name: this.form.value.firstname,
            student_fname: this.form.value.fathername,
            group_id: this.data.groupID,
            photo: this.image,
            password: this.form.value.password,
            password_confirm: this.form.value.password_confirm,
            plain_password: this.form.value.password,
        };

        const studentInfo: StudentInfo = {
            email: this.form.value.email,
            username: this.form.value.username,
        };

        if (this.image === '' && this.data.isUpdateData) {
            formData.photo = this.student.photo;
        }

        return Object.assign({}, formData, studentInfo);
    }

    submit(): void {
        if (this.form.invalid) {
            return;
        }

        this.form.disable();
        this.submitted = true;
        this.loading = true;

        const newStudent = this.studentData();

        if (this.data.isUpdateData) {
            this.update(newStudent);
        } else {
            this.create(newStudent);
        }
    }

    update(newStudent: Student): void {
        this.studentSubscription = this.studentsService
            .update(this.student.user_id, newStudent)
            .subscribe(
                (response: Response) => {
                    this.form.enable();
                    this.loading = false;
                    this.closeModal({
                        message: response,
                        data: newStudent,
                        id: this.student.user_id,
                    });
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: 'Помилка' });
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    create(newStudent: Student): void {
        this.studentSubscription = this.studentsService
            .create(newStudent)
            .subscribe(
                (response: Response) => {
                    this.form.enable();
                    this.loading = false;
                    this.closeModal({
                        message: response,
                        data: newStudent,
                        id: response.id,
                    });
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: 'Помилка' });
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    fileInput(): void {
        this.inputRef.nativeElement.click();
    }

    fileUpload(event: Event): void {
        const file: File = (event.target as HTMLInputElement).files[0];
        const reader: FileReader = new FileReader();
        reader.onload = () => {
            this.image = reader.result;
        };
        reader.readAsDataURL(file);
    }

    errorHandler(error: Response, title: string, message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title,
                error,
            },
        });
    }

    closeModal(dialogResult: DialogResult = { message: 'Скасовано' }): void {
        this.dialogRef.close(dialogResult);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
