import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SubjectsService } from '../subjects.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ConfirmDeleteComponent } from '../../groups/confirm-delete/confirm-delete.component';

interface SubjectsResponse {
    subject_id: number;
    subject_name: string;
    subject_description: string;
}
interface SubjectsRequest {
    subject_name: string;
    subject_description: string;
}

@Component({
    selector: 'app-owner-list',
    templateUrl: './subjects-home.component.html',
    styleUrls: ['./subjects-home.component.scss'],
})
export class SubjectsHomeComponent implements OnInit, AfterViewInit {
    public displayedColumns = [
        '№',
        'subject_name',
        'subject_description',
        'operations',
    ];
    public dataSource = new MatTableDataSource<SubjectsResponse>();
    subjectSubscription: Subscription;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private subjectsService: SubjectsService,
        public dialog: MatDialog,
        private router: Router,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.getSubjects();
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    public getSubjects() {
        this.subjectSubscription = this.subjectsService
            .getData()
            .subscribe((response) => {
                this.dataSource.data = response;
                this.modalService.showSnackBar('Предмети завантажено');
            });
    }

    public redirectToCreate = (data: SubjectsRequest) => {
        this.subjectSubscription = this.subjectsService
            .create(data)
            .subscribe((result: SubjectsResponse) => {
                this.dataSource.data = this.dataSource.data.concat(result[0]);
                this.dataSource.paginator.lastPage();
                this.modalService.showSnackBar('Предмети додано');
            });
    };

    public redirectToUpdate = (id: number, body: SubjectsResponse) => {
        this.subjectSubscription = this.subjectsService
            .update(id, body)
            .subscribe((result: SubjectsResponse) => {
                const newSourse = this.dataSource.data.map((item) => {
                    if (item.subject_id === id) {
                        return (item = {
                            ...result[0],
                        });
                    } else {
                        return item;
                    }
                });
                this.dataSource.data = newSourse;
                this.modalService.showSnackBar('Предмети оновлено');
            });
    };
    redirectToDelete(subject: SubjectsResponse): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: subject.subject_name,
            },
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.delete(subject.subject_id);
            } else {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    public delete = (id: number) => {
        this.subjectSubscription = this.subjectsService.delete(id).subscribe(
            () => {
                this.dataSource.data = this.dataSource.data.filter(
                    (item) => item.subject_id !== id
                );
                this.modalService.showSnackBar('Предмети видалено');
            },
            (error) =>
                this.modalService.showSnackBar('Помилка при видаленні предмету')
        );
    };

    public onCreate(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '300px',
        });

        dialogRef.afterClosed().subscribe((result: SubjectsRequest) => {
            if (result) {
                const updResult = { ...result };
                for (const k in updResult) {
                    if (!updResult[k]) delete updResult[k];
                }
                this.redirectToCreate(updResult);
            }
        });
    }

    public onEdit(element: SubjectsResponse): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '300px',
            data: element,
        });

        dialogRef.afterClosed().subscribe((result: SubjectsResponse) => {
            if (result) {
                this.redirectToUpdate(result.subject_id, result);
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public redirectToTests(id: string) {
        this.router.navigate(['admin/subjects/tests/', id], {});
    }
    public redirectToTimetable(subject: SubjectsResponse) {
        this.router.navigate(['admin/subjects/timetable/'], {
            queryParams: {
                subject_name: subject.subject_name,
                subject_id: subject.subject_id,
            },
        });
    }
    ngOnDestroy(): void {
        if (this.subjectSubscription) {
            this.subjectSubscription.unsubscribe();
        }
    }
}
