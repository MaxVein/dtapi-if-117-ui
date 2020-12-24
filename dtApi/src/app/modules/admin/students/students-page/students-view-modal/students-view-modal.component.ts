import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentsService } from 'src/app/modules/admin/students/services/students.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    StudentProfileData,
} from 'src/app/shared/interfaces/entity.interfaces';
import { environment } from 'src/environments/environment';
import { studentsMessages } from '../../../Messages';

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
        private alertService: AlertService
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
                    if (!response) {
                        this.closeModal({
                            message: studentsMessages('viewDataError'),
                        });
                    } else {
                        this.student = response;
                        this.loading = false;
                    }
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

    closeModal(
        dialogResult: DialogResult = { message: studentsMessages('modalClose') }
    ): void {
        this.dialogRef.close(dialogResult);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
