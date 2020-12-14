import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StudentsModalComponent } from '../students-modal/students-modal.component';
import { StudentsTransferModalComponent } from '../students-transfer-modal/students-transfer-modal.component';
import { StudentsViewModalComponent } from '../students-view-modal/students-view-modal.component';
import { ConfirmComponent } from '../../../../../shared/components/confirm/confirm.component';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { ModalService } from '../../../../../shared/services/modal.service';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Student,
} from '../../../../../shared/interfaces/entity.interfaces';
import {
    cancelErrorMessage,
    closeError,
    closeMessageE,
    errorMessage,
    notStudentDataMessage,
    notViewStudentData,
    removeStudentMessage,
    studentRemoveMessage,
    studentsTableColumns,
    titleErrorMessage,
    transferStudentMessage,
    updateStudentMessage,
} from '../../../Messages';

@Component({
    selector: 'app-students-table',
    templateUrl: './students-table.component.html',
    styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements AfterViewInit, OnDestroy {
    @Input() dataSource = new MatTableDataSource<Student>();
    @Input() groupID: number;
    isUpdateData = false;
    displayedColumns: string[] = studentsTableColumns;
    studentSubscription: Subscription;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private studentsService: StudentsService,
        public modalService: ModalService
    ) {}

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    edit(student: Student): void {
        this.isUpdateData = true;
        this.modalService.openModal(
            StudentsModalComponent,
            {
                disableClose: true,
                autoFocus: false,
                width: '500px',
                height: '750px',
                data: {
                    isUpdateData: this.isUpdateData,
                    studentData: student,
                },
            },
            (result: DialogResult) => {
                if (result.message === titleErrorMessage) {
                    this.modalService.showSnackBar(closeError);
                } else if (result.message.response === 'ok') {
                    const index = this.dataSource.data.findIndex(
                        (s) => s.user_id === result.id
                    );
                    result.data.user_id = result.id;
                    this.dataSource.data[index] = result.data;
                    this.dataSource._updateChangeSubscription();
                    this.modalService.showSnackBar(updateStudentMessage);
                } else if (result.message === cancelErrorMessage) {
                    this.modalService.showSnackBar(cancelErrorMessage);
                }
            }
        );
    }

    transfer(student: Student): void {
        this.modalService.openModal(
            StudentsTransferModalComponent,
            {
                disableClose: true,
                data: {
                    studentData: student,
                },
            },
            (result: DialogResult) => {
                if (result.message === titleErrorMessage) {
                    this.modalService.showSnackBar(closeError);
                } else if (result.message.response === 'ok') {
                    this.dataSource.data = this.dataSource.data.filter(
                        (s) => s.user_id !== result.id
                    );
                    this.modalService.showSnackBar(transferStudentMessage);
                } else if (result.message === cancelErrorMessage) {
                    this.modalService.showSnackBar(cancelErrorMessage);
                }
            }
        );
    }

    view(student: Student): void {
        this.modalService.openModal(
            StudentsViewModalComponent,
            {
                disableClose: true,
                data: {
                    studentID: student.user_id,
                    groupID: student.group_id,
                },
            },
            (result: DialogResult) => {
                if (result.message === closeMessageE) {
                    this.modalService.showSnackBar(closeMessageE);
                } else if (result.message === titleErrorMessage) {
                    this.modalService.showSnackBar(closeError);
                } else if (result.message === notViewStudentData) {
                    this.modalService.showSnackBar(notStudentDataMessage);
                }
            }
        );
    }

    remove(firstname: string, lastname: string, id: string): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'person_remove',
                    message: removeStudentMessage(firstname, lastname),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.delete(id);
                } else if (!result) {
                    this.modalService.showSnackBar(cancelErrorMessage);
                }
            }
        );
    }

    delete(id: string): void {
        this.studentSubscription = this.studentsService.remove(id).subscribe(
            (response: Response) => {
                if (response) {
                    this.dataSource.data = this.dataSource.data.filter(
                        (s) => s.user_id !== id
                    );
                    this.modalService.showSnackBar(studentRemoveMessage);
                }
            },
            (error: Response) => {
                this.errorHandler(error, titleErrorMessage, errorMessage);
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

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
