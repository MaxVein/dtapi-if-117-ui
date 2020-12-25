import { Component, ViewChild, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ModalService } from 'src/app/shared/services/modal.service';
import { TimatableService } from './timatable.service';
import { TimeTable, ServiceResponse } from './timetable.interfaces';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TimetableDialogComponent } from './timetable-dialog/timetable-dialog.component';
import { ConfirmDeleteComponent } from '../groups/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-timatable',
    templateUrl: './timatable.component.html',
    styleUrls: ['./timatable.component.scss'],
})
export class TimatableComponent implements OnInit {
    subject_name: string;
    subject_id: string;
    testRate: string;
    levels: number[];
    groups;
    displayedColumns: string[] = [
        'id',
        'group',
        'startDate',
        'startTime',
        'endDate',
        'endTime',
        'actions',
    ];

    dataSource = new MatTableDataSource<TimeTable>();
    timetableSubscription: Subscription;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private timetable: TimatableService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((param) => {
            this.subject_name = param['subject_name'];
            this.subject_id = param['subject_id'];
        });
        this.getTimeTable();
    }

    getTimeTable() {
        this.timetableSubscription = forkJoin({
            timetable: this.timetable.getTimatable(this.subject_id),
            groups: this.timetable.getData('group'),
        }).subscribe(
            (res: ServiceResponse) => {
                const source = res.timetable.map((element: TimeTable) => {
                    return {
                        ...element,
                        group_name: this.getGroupName(
                            element.group_id,
                            res.groups
                        ),
                    };
                });
                this.groups = res.groups;
                this.dataSource.data = source;
                this.dataSource.paginator = this.paginator;
            },
            (err) => {
                this.modalService.showSnackBar(
                    'Сталася помилка при завантаженні деталей тесту'
                );
            }
        );
    }

    getGroupName(id: string, groups) {
        const newSource = groups.filter((element) => element.group_id === id);
        return newSource[0].group_name;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(TimetableDialogComponent, {
            width: '600px',
            data: {
                groups: this.groups,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.add(result);
        });
    }

    openEditDialog(timaTable: TimeTable): void {
        const dialogRef = this.dialog.open(TimetableDialogComponent, {
            width: '600px',
            data: {
                groups: this.groups,
                group_id: timaTable.group_id,
                subject_id: timaTable.subject_id,
                start_date: timaTable.start_date,
                start_time: timaTable.start_time,
                end_date: timaTable.end_date,
                end_time: timaTable.end_time,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.edit(result, timaTable.timetable_id);
            }
        });
    }

    add(timetable: TimeTable): void {
        const newTimetable = {
            subject_id: this.subject_id,
            ...timetable,
            start_date: this.getDate(timetable.start_date),
            end_date: this.getDate(timetable.end_date),
        };
        this.timetableSubscription = this.timetable
            .insertData('timeTable', newTimetable)
            .subscribe((result: Array<TimeTable>) => {
                const source = {
                    ...result[0],
                    group_name: this.getGroupName(
                        result[0].group_id,
                        this.groups
                    ),
                };
                this.dataSource.data = this.dataSource.data.concat(source);
                this.dataSource.paginator.lastPage();
                this.dataSource.paginator = this.paginator;
                this.modalService.showSnackBar('Розклад додано');
            });
    }

    getDate(Date: Date) {
        const currDate = Date.getDate();
        const currMonth = Date.getMonth() + 1;
        const currYear = Date.getFullYear();
        return currYear + '-' + currMonth + '-' + currDate;
    }
    edit(timetable: TimeTable, id: string): void {
        const newTimetable = {
            subject_id: this.subject_id,
            ...timetable,
            start_date:
                typeof timetable.start_date === 'string'
                    ? timetable.start_date
                    : this.getDate(timetable.start_date),
            end_date:
                typeof timetable.end_date === 'string'
                    ? timetable.end_date
                    : this.getDate(timetable.end_date),
        };
        this.timetableSubscription = this.timetable
            .updateData('timeTable', id, newTimetable)
            .subscribe((data: Array<TimeTable>) => {
                const newSourse = this.dataSource.data.map((item) => {
                    if (item.timetable_id === id) {
                        return (item = {
                            ...data[0],
                            group_name: this.getGroupName(
                                data[0].group_id,
                                this.groups
                            ),
                        });
                    } else {
                        return item;
                    }
                });
                this.dataSource.data = newSourse;
                this.modalService.showSnackBar('Розклад оновлено');
            });
    }

    removeTimeTable(timetable: TimeTable): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: timetable.timetable_id,
            },
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.removeTest(timetable);
            } else {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    removeTest(timeTable: TimeTable): void {
        this.timetableSubscription = this.timetable
            .delData('timeTable', timeTable.timetable_id)
            .subscribe(
                () => {
                    this.dataSource.data = this.dataSource.data.filter(
                        (t) => t.timetable_id !== timeTable.timetable_id
                    );
                    this.modalService.showSnackBar('Тест з розкладу видалено');
                },
                (error) =>
                    this.modalService.showSnackBar('Помилка при видаленні')
            );
    }

    ngOnDestroy(): void {
        if (this.timetableSubscription) {
            this.timetableSubscription.unsubscribe();
        }
    }
}
