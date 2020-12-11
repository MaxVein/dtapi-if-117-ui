import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { StudentsService } from 'src/app/modules/admin/students/services/students.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Faculty,
    Group,
    Response,
    Student,
    StudentInfo,
} from 'src/app/shared/interfaces/entity.interfaces';
import {
    cancelErrorMessage,
    getFacultyErrorMessage,
    getGroupErrorMessage,
    getUpdateErrorMessage,
    titleErrorMessage,
    transferStudentErrorMessage,
} from '../../../Messages';

@Component({
    selector: 'app-students-transfer-modal',
    templateUrl: './students-transfer-modal.component.html',
    styleUrls: ['./students-transfer-modal.component.scss'],
})
export class StudentsTransferModalComponent implements OnInit, OnDestroy {
    loading = false;
    submitted = false;
    student: Student = this.data.studentData;
    studentInfo: StudentInfo;
    faculties: Faculty[] = [];
    groups: Group[] = [];
    selectedFaculty = false;
    selectedGroupID: number;
    studentSubscription: Subscription;

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
                    };
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: titleErrorMessage });
                    this.errorHandler(
                        error,
                        titleErrorMessage,
                        getUpdateErrorMessage
                    );
                }
            );
    }

    getFacultyList(): void {
        this.studentSubscription = this.studentsService
            .getEntityFaculty()
            .subscribe(
                (response: Faculty[]) => {
                    this.faculties = response;
                    this.loading = false;
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: titleErrorMessage });
                    this.errorHandler(
                        error,
                        titleErrorMessage,
                        getFacultyErrorMessage
                    );
                }
            );
    }

    getGroups(event: MatSelectChange): void {
        this.studentSubscription = this.studentsService
            .getEntityGroupsByFaculty(event.value)
            .subscribe(
                (response: Group[]) => {
                    this.groups = response;
                    this.selectedFaculty = true;
                },
                (error: Response) => {
                    this.closeModal({ message: titleErrorMessage });
                    this.errorHandler(
                        error,
                        titleErrorMessage,
                        getGroupErrorMessage
                    );
                }
            );
    }

    getGroup(event: MatSelectChange): void {
        this.selectedGroupID = event.value;
        this.submitted = true;
    }

    submit(): void {
        this.loading = true;
        this.student.group_id = this.selectedGroupID;
        const updateStudent = Object.assign({}, this.student, this.studentInfo);
        this.update(updateStudent);
    }

    update(updateStudent: Student): void {
        this.studentSubscription = this.studentsService
            .update(this.student.user_id, updateStudent)
            .subscribe(
                (response: Response) => {
                    this.loading = false;
                    this.closeModal({
                        message: response,
                        id: this.student.user_id,
                    });
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: titleErrorMessage });
                    this.errorHandler(
                        error,
                        titleErrorMessage,
                        transferStudentErrorMessage
                    );
                }
            );
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

    closeModal(
        dialogResult: DialogResult = { message: cancelErrorMessage }
    ): void {
        this.dialogRef.close(dialogResult);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
