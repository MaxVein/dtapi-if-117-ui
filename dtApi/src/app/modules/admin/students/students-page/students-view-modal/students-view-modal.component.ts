import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { StudentsService } from 'src/app/modules/admin/students/services/students.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    StudentProfileData,
} from 'src/app/shared/interfaces/entity.interfaces';
import { environment } from 'src/environments/environment';
import {
    closeMessageE,
    getUpdateErrorMessage,
    titleErrorMessage,
} from '../../../Messages';

@Component({
    selector: 'app-students-view-modal',
    templateUrl: './students-view-modal.component.html',
    styleUrls: ['./students-view-modal.component.scss'],
})
export class StudentsViewModalComponent implements OnInit, OnDestroy {
    loading = false;
    student: StudentProfileData;
    studentID = this.data.studentID;
    groupID = this.data.groupID;
    defaultImage: string = environment.defaultImage;
    studentSubscription: Subscription;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsViewModalComponent>,
        private studentsService: StudentsService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
    }

    getStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getAllStudentData(this.studentID, this.groupID)
            .subscribe(
                (response: StudentProfileData) => {
                    this.student = response;
                    this.loading = false;
                },
                (error: Response) => {
                    this.loading = false;
                    this.closeModal({ message: titleErrorMessage });
                    this.modalService.openModal(AlertComponent, {
                        data: {
                            message: getUpdateErrorMessage,
                            title: titleErrorMessage,
                            error,
                        },
                    });
                }
            );
    }

    closeModal(dialogResult: DialogResult = { message: closeMessageE }): void {
        this.dialogRef.close(dialogResult);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
