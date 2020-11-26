import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSelectChange } from '@angular/material/select'
import { AlertComponent } from 'src/app/shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students.service'
import { ModalService } from 'src/app/shared/services/modal.service'
import { Subscription } from 'rxjs'
import {
    DialogResult,
    Faculty,
    Group,
    Response,
    Student,
    StudentInfo,
} from 'src/app/shared/interfaces/interfaces'

@Component({
    selector: 'app-students-transfer-modal',
    templateUrl: './students-transfer-modal.component.html',
    styleUrls: ['./students-transfer-modal.component.scss'],
})
export class StudentsTransferModalComponent implements OnInit, OnDestroy {
    loading = false
    submitted = false
    student: Student = this.data.STUDENT_DATA
    studentInfo: StudentInfo
    faculties: Faculty[] = []
    groups: Group[] = []
    selectedGroupID: number
    studentSubscription: Subscription

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsTransferModalComponent>,
        private studentsService: StudentsService,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
        this.getFacultyList();
    }

    getStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById('AdminUser', this.student.user_id)
            .subscribe(
                (response: StudentInfo[]) => {
                    this.studentInfo = {
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
                    });
                }
            );
    }

    getFacultyList(): void {
        this.studentSubscription = this.studentsService
            .getEntityFaculty()
            .subscribe(
                (response: Faculty[]) => {
                    this.faculties = response
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
                    });
                }
            );
    }

    getGroups(event: MatSelectChange): void {
        this.studentSubscription = this.studentsService
            .getEntityGroupsByFaculty(event.value)
            .subscribe(
                (response: Group[]) => {
                    this.groups = response
                },
                (error: Response) => {
                    const message = 'Сталася помилка. Спробуйте знову'
                    const title = 'Помилка'
                    this.closeModal({ message: title })
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message,
                            title,
                            error,
                        },
                    });
                }
            );
    }

    getGroup(event: MatSelectChange): void {
        this.selectedGroupID = event.value;
        this.submitted = true;
    }

    submit(): void {
        this.loading = true
        this.student.group_id = this.selectedGroupID
        const updateStudent = Object.assign({}, this.student, this.studentInfo)
        this.studentSubscription = this.studentsService
            .update(this.student.user_id, updateStudent)
            .subscribe(
                (response: Response) => {
                    this.loading = false
                    this.closeModal({
                        message: response,
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
                    });
                }
            );
    }

    closeModal(dialogResult: DialogResult = { message: 'Скасовано' }): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
