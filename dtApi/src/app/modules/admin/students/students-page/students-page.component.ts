import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsModalComponent } from './students-modal/students-modal.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { StudentsService } from 'src/app/modules/admin/students/services/students.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    Student,
    Response,
    GroupInfoState,
    DialogResult,
} from 'src/app/shared/interfaces/entity.interfaces';
import {
    addStudentMessage,
    cancelErrorMessage,
    closeError,
    errorMessage,
    notStudentsMessage,
    titleErrorMessage,
    uploadStudentsMessage,
} from '../../Messages';

@Component({
    selector: 'app-students-page',
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss'],
})
export class StudentsPageComponent implements OnInit, OnDestroy {
    loading = false;
    isUpdateData = false;
    dataSource = new MatTableDataSource<Student>();
    groupID: number;
    groupName: string;
    studentSubscription: Subscription;

    constructor(
        private studentsService: StudentsService,
        private router: Router,
        public modalService: ModalService
    ) {
        this.initGroupInfo();
    }

    ngOnInit(): void {
        this.loading = true;
        this.getStudentsByGroup();
    }

    initGroupInfo(): void {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state) {
            const state = navigation.extras.state as GroupInfoState;
            this.groupName = state.groupName;
            this.groupID = state.id;
            localStorage.setItem('group_name', JSON.stringify(state.groupName));
            localStorage.setItem('group_id', JSON.stringify(state.id));
        } else {
            this.groupName = JSON.parse(localStorage.getItem('group_name'));
            this.groupID = JSON.parse(localStorage.getItem('group_id'));
        }
    }

    getStudentsByGroup(): void {
        this.studentSubscription = this.studentsService
            .getByGroup(this.groupID, true)
            .subscribe(
                (response: Student[]) => {
                    if (response.length) {
                        this.dataSource.data = response;
                        this.loading = false;
                        this.modalService.showSnackBar(uploadStudentsMessage);
                    } else {
                        this.dataSource.data = [];
                        this.loading = false;
                        this.modalService.showSnackBar(notStudentsMessage);
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(error, titleErrorMessage, errorMessage);
                }
            );
    }

    add(): void {
        this.isUpdateData = false;
        this.modalService.openModal(
            StudentsModalComponent,
            {
                disableClose: true,
                autoFocus: false,
                width: '500px',
                height: '750px',
                data: {
                    groupID: this.groupID,
                    isUpdateData: this.isUpdateData,
                },
            },
            (result: DialogResult) => {
                if (result.message === titleErrorMessage) {
                    this.modalService.showSnackBar(closeError);
                } else if (result.message.response === 'ok') {
                    result.data.user_id = result.id;
                    this.dataSource.data.unshift(result.data);
                    this.dataSource._updateChangeSubscription();
                    this.dataSource.paginator.firstPage();
                    this.modalService.showSnackBar(addStudentMessage);
                } else if (result.message === cancelErrorMessage) {
                    this.modalService.showSnackBar(cancelErrorMessage);
                }
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
        this.router.navigate(['/admin/group']);
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
