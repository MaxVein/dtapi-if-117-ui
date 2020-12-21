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
import { ModalService } from '../../../../../shared/services/modal.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Student,
} from '../../../../../shared/interfaces/entity.interfaces';
import { studentsMessages, studentsTableColumns } from '../../../Messages';

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
        public modalService: ModalService,
        private alertService: AlertService
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
                if (result.message === studentsMessages('modalError')) {
                    this.alertService.message(
                        studentsMessages('modalErrClose')
                    );
                } else if (result.message.response === 'ok') {
                    const index = this.dataSource.data.findIndex(
                        (s) => s.user_id === result.id
                    );
                    result.data.user_id = result.id;
                    this.dataSource.data[index] = result.data;
                    this.dataSource._updateChangeSubscription();
                    this.alertService.message(studentsMessages('update'));
                } else if (result.message === studentsMessages('modalCancel')) {
                    this.alertService.message(studentsMessages('modalCancel'));
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
                if (result.message === studentsMessages('modalError')) {
                    this.alertService.message(
                        studentsMessages('modalErrClose')
                    );
                } else if (result.message.response === 'ok') {
                    this.dataSource.data = this.dataSource.data.filter(
                        (s) => s.user_id !== result.id
                    );
                    this.alertService.message(studentsMessages('transfer'));
                } else if (result.message === studentsMessages('modalCancel')) {
                    this.alertService.message(studentsMessages('modalCancel'));
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
                if (result.message === studentsMessages('modalError')) {
                    this.alertService.message(
                        studentsMessages('modalErrClose')
                    );
                } else if (result.message === studentsMessages('modalClose')) {
                    this.alertService.message(studentsMessages('modalClose'));
                } else if (
                    result.message === studentsMessages('viewDataError')
                ) {
                    this.alertService.message(studentsMessages('notViewData'));
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
                    message: studentsMessages(
                        'confirmRemove',
                        firstname,
                        lastname
                    ),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.delete(id);
                } else if (!result) {
                    this.alertService.message(studentsMessages('modalCancel'));
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
                    this.alertService.message(studentsMessages('remove'));
                }
            },
            (error: Response) => {
                this.alertService.error(studentsMessages('removeError'));
            }
        );
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
