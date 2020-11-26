import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AlertComponent } from '../../../../../shared/components/alert/alert.component'
import { StudentsService } from 'src/app/modules/admin/students/students.service'
import { ModalService } from '../../../../../shared/services/modal.service'
import { Subscription } from 'rxjs'
import {
    DialogResult,
    Faculty,
    Group,
    Response,
    Speciality,
    Student,
    StudentInfo,
} from 'src/app/shared/interfaces/interfaces'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-students-view-modal',
    templateUrl: './students-view-modal.component.html',
    styleUrls: ['./students-view-modal.component.scss'],
})
export class StudentsViewModalComponent implements OnInit, OnDestroy {
    loading = false
    student: Student
    studentInfo: StudentInfo
    student_id = this.data.STUDENT_ID
    group_id = this.data.GROUP_ID
    groupName: string
    facultyName: string
    specialityName: string
    defaultImage = environment.defaultImage
    studentSubscription: Subscription

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StudentsViewModalComponent>,
        private studentsService: StudentsService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
        this.getGroupInfo();
    }

    getStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById('Student', this.student_id)
            .subscribe(
                (response: Student[]) => {
                    this.student = response[0]
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
                    });
                }
            );
    }

    getOtherStudentInfo(): void {
        this.studentSubscription = this.studentsService
            .getById('AdminUser', this.student_id)
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

    getGroupInfo(): void {
        this.studentSubscription = this.studentsService
            .getGroupData(this.group_id)
            .subscribe(
                (response: Group[]) => {
                    this.groupName = response[0].group_name
                    this.getFacultyInfo(response[0].faculty_id)
                    this.getSpecialityInfo(response[0].speciality_id)
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

    getFacultyInfo(id: string): void {
        this.studentSubscription = this.studentsService
            .getFacultyData(id)
            .subscribe(
                (response: Faculty[]) => {
                    this.facultyName = response[0].faculty_name
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

    getSpecialityInfo(id: string): void {
        this.studentSubscription = this.studentsService
            .getSpecialityData(id)
            .subscribe(
                (response: Speciality[]) => {
                    this.specialityName = response[0].speciality_name
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

    closeModal(dialogResult: DialogResult = { message: 'Закрито' }): void {
        this.dialogRef.close(dialogResult)
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
