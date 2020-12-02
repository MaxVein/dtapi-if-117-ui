import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsModalComponent } from './students-modal/students-modal.component';
import { StudentsViewModalComponent } from './students-view-modal/students-view-modal.component';
import { StudentsTransferModalComponent } from './students-transfer-modal/students-transfer-modal.component';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { StudentsService } from 'src/app/modules/admin/students/students.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    Student,
    Response,
    DialogResult,
} from 'src/app/shared/interfaces/interfaces';

@Component({
    selector: 'app-students-page',
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss'],
})
export class StudentsPageComponent implements OnInit, AfterViewInit, OnDestroy {
    loading = false;
    isUpdateData = false;
    groupID: number;
    groupName: string;
    displayedColumns: string[] = [
        'index',
        'gradebookID',
        'studentInfo',
        'actions',
    ];
    dataSource = new MatTableDataSource<Student>();
    studentSubscription: Subscription;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private studentsService: StudentsService,
        private route: ActivatedRoute,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.groupID = this.route.snapshot.params['id'];
        this.route.queryParams.subscribe((param) => {
            this.groupName = param['groupName'];
        });
        this.loading = true;
        this.getStudentsByGroup();
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
    }

    getStudentsByGroup(): void {
        this.studentSubscription = this.studentsService
            .getByGroup(this.groupID, true)
            .subscribe(
                (response: Student[]) => {
                    if (response.length) {
                        this.dataSource.data = response;
                        this.loading = false;
                        this.modalService.showSnackBar('Студентів завантажено');
                    } else {
                        this.dataSource.data = [];
                        this.loading = false;
                        this.modalService.showSnackBar(
                            'У вибраній групі відсутні студенти'
                        );
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
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
                if (result.message === 'Помилка') {
                    this.modalService.showSnackBar('Закрито через помилку');
                } else if (result.message.response === 'ok') {
                    result.data.user_id = result.id;
                    this.dataSource.data.unshift(result.data);
                    this.dataSource._updateChangeSubscription();
                    this.modalService.showSnackBar('Студента додано');
                } else if (result.message === 'Скасовано') {
                    this.modalService.showSnackBar('Скасовано');
                }
            }
        );
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
                if (result.message === 'Помилка') {
                    this.modalService.showSnackBar('Закрито через помилку');
                } else if (result.message.response === 'ok') {
                    const index = this.dataSource.data.findIndex(
                        (s) => s.user_id === result.id
                    );
                    result.data.user_id = result.id;
                    this.dataSource.data[index] = result.data;
                    this.dataSource._updateChangeSubscription();
                    this.modalService.showSnackBar('Дані студента оновлено');
                } else if (result.message === 'Скасовано') {
                    this.modalService.showSnackBar('Скасовано');
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
                if (result.message === 'Помилка') {
                    this.modalService.showSnackBar('Закрито через помилку');
                } else if (result.message.response === 'ok') {
                    this.dataSource.data = this.dataSource.data.filter(
                        (s) => s.user_id !== result.id
                    );
                    this.modalService.showSnackBar('Студента переведено');
                } else if (result.message === 'Скасовано') {
                    this.modalService.showSnackBar('Скасовано');
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
                if (result.message === 'Закрито') {
                    this.modalService.showSnackBar('Закрито');
                } else if (result.message === 'Помилка') {
                    this.modalService.showSnackBar('Закрито через помилку');
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
                    message: `Видалити студента ${firstname} ${lastname}?`,
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.delete(id);
                } else if (!result) {
                    this.modalService.showSnackBar('Скасовано');
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
                    this.modalService.showSnackBar('Студента було видалено');
                }
            },
            (error: Response) => {
                this.errorHandler(
                    error,
                    'Помилка',
                    'Сталася помилка. Спробуйте знову'
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

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
