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
import { StudentsService } from 'src/app/modules/admin/students/services/students.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Observable, of, Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Student,
    StudentInfo,
    StudentProfileData,
    ValidateStudentData,
} from 'src/app/shared/interfaces/entity.interfaces';
import { environment } from 'src/environments/environment';
import { studentsMessages } from '../../../Messages';

@Component({
    selector: 'app-students-modal',
    templateUrl: './students-modal.component.html',
    styleUrls: ['./students-modal.component.scss'],
})
export class StudentsModalComponent implements OnInit, OnDestroy {
    @ViewChild('imageFile') inputRef: ElementRef;

    form: FormGroup;
    loading = false;
    submitted = false;
    hide = true;
    student: Student = this.data.studentData;
    validateData: ValidateStudentData;
    image: string | ArrayBuffer = '';
    defaultImage = environment.defaultImage;
    studentSubscription: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsModalComponent>,
        private formBuilder: FormBuilder,
        private studentsService: StudentsService,
        private alertService: AlertService
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
                .getStudentDataForUpdate(this.student.user_id)
                .subscribe(
                    (response: StudentProfileData) => {
                        this.student.photo = response.photo;
                        this.form.get('username').setValue(response.username);
                        this.form.get('email').setValue(response.email);
                        this.validateData = {
                            gradebook_id: response.gradebook_id,
                            username: response.username,
                            email: response.email,
                        };
                        this.loading = false;
                    },
                    (error: Response) => {
                        this.loading = false;
                        this.closeModal({
                            message: studentsMessages('modalError'),
                        });
                        this.alertService.error(studentsMessages('viewError'));
                    }
                );
        }
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

        if (!formData && !studentInfo) {
            this.alertService.warning(studentsMessages('newStudentError'));
        } else {
            return Object.assign({}, formData, studentInfo);
        }
    }

    submit(): void {
        if (this.form.invalid) {
            this.alertService.warning(studentsMessages('formInvalid'));
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
                    this.closeModal({
                        message: studentsMessages('modalError'),
                    });
                    this.alertService.error(studentsMessages('updateError'));
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
                    this.closeModal({
                        message: studentsMessages('modalError'),
                    });
                    this.alertService.error(studentsMessages('createError'));
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

    closeModal(
        dialogResult: DialogResult = {
            message: studentsMessages('modalCancel'),
        }
    ): void {
        this.dialogRef.close(dialogResult);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
