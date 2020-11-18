import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { StudentsService } from '../../shared/services/students/students.service'
import { ModalService } from '../../shared/services/modal.service'
import { StudentsModalComponent } from './students-modal/students-modal.component'
import { StudentsViewModalComponent } from './students-view-modal/students-view-modal.component'
import { StudentsTransferModalComponent } from './students-transfer-modal/students-transfer-modal.component'
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component'
import { Student } from '../../shared/interfaces/students/interfaces'

@Component({
    selector: 'app-students-page',
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss'],
})
export class StudentsPageComponent implements OnInit, AfterViewInit, OnDestroy {
    groupID: number
    loading = false
    isUpdateData = false
    studentSubscription: Subscription
    displayedColumns: string[] = [
        'index',
        'gradebookID',
        'studentInfo',
        'actions',
    ]
    dataSource = new MatTableDataSource<Student>()

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator

    constructor(
        private studentsService: StudentsService,
        private route: ActivatedRoute,
        private router: Router,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentsByGroup()
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }

    getStudentsByGroup(): void {
        this.groupID = this.route.snapshot.params['id']
        this.studentSubscription = this.studentsService
            .getByGroup(this.groupID)
            .subscribe(
                (response) => {
                    this.dataSource.data = response
                    this.loading = false
                    this.modalService.showSnackBar('Студентів завантажено')
                },
                (error) => {
                    if (error.status === 403) {
                        this.modalService.showSnackBar('Ви не авторизовані')
                        this.router.navigate(['/login'])
                    } else {
                        this.modalService.showSnackBar(
                            'Проблеми із сервером! Перезавантажте сторінку'
                        )
                    }
                }
            )
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()
    }

    add(): void {
        this.isUpdateData = false
        this.modalService.openModal(
            StudentsModalComponent,
            {
                disableClose: true,
                data: {
                    group_id: this.groupID,
                    isUpdateData: this.isUpdateData,
                },
            },
            (result) => {
                if (!result) {
                    this.modalService.showSnackBar(
                        'Сталася помилка! Спробуйте знову'
                    )
                } else if (result.response === 'ok') {
                    this.loading = true
                    this.getStudentsByGroup()
                    this.modalService.showSnackBar('Студента додано')
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                } else if (result === 'Скасовано') {
                    this.modalService.showSnackBar('Скасовано')
                }
            }
        )
    }

    edit(student: Student): void {
        this.isUpdateData = true
        this.modalService.openModal(
            StudentsModalComponent,
            {
                disableClose: true,
                data: {
                    group_id: this.groupID,
                    isUpdateData: this.isUpdateData,
                    student_data: student,
                },
            },
            (result) => {
                if (!result) {
                    this.modalService.showSnackBar(
                        'Сталася помилка! Спробуйте знову'
                    )
                } else if (result.response === 'ok') {
                    this.loading = true
                    this.getStudentsByGroup()
                    this.modalService.showSnackBar('Дані студента оновлено')
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                } else if (result === 'Скасовано') {
                    this.modalService.showSnackBar('Скасовано')
                }
            }
        )
    }

    transfer(student: Student): void {
        this.modalService.openModal(
            StudentsTransferModalComponent,
            {
                disableClose: true,
                data: {
                    group_id: this.groupID,
                    student_data: student,
                },
            },
            (result) => {
                if (result) {
                    this.modalService.showSnackBar('Скасовано')
                }
            }
        )
    }

    view(student: Student): void {
        this.modalService.openModal(
            StudentsViewModalComponent,
            {
                disableClose: true,
                data: {
                    group_id: this.groupID,
                    student_data: student,
                },
            },
            (result) => {
                if (result) {
                    this.modalService.showSnackBar('Закрито')
                }
            }
        )
    }

    remove(firstname: string, lastname: string, id: string): void {
        const message = `Видалити студента ${firstname} ${lastname}?`
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    message,
                },
            },
            (result) => {
                if (result) {
                    this.studentsService.remove(id).subscribe((data) => {
                        if (data) {
                            this.dataSource.data = this.dataSource.data.filter(
                                (s) => s.user_id !== id
                            )
                            this.modalService.showSnackBar(
                                'Студента було видалено'
                            )
                        }
                    })
                }
            }
        )
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
