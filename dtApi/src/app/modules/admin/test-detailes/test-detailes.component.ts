import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TestService } from '../test/services/test.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { TestDetails, TestRate } from './test-detailes.interfaces';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TestDetailsDialogComponent } from './test-details-dialog/test-details-dialog.component';
import { ConfirmDeleteComponent } from '../groups/confirm-delete/confirm-delete.component';

@Component({
    selector: 'app-test-detailes',
    templateUrl: './test-detailes.component.html',
    styleUrls: ['./test-detailes.component.scss'],
})
export class TestDetailesComponent implements OnInit, AfterViewInit {
    tests: TestDetails[] = [];
    test_id: number;
    testRate: string;
    levels: number[];
    displayedColumns: string[] = ['id', 'level', 'tasks', 'rate', 'actions'];

    dataSource = new MatTableDataSource<TestDetails>();
    testDetailesSubscription: Subscription;

    @ViewChild('table', { static: true }) table: MatTable<TestDetails>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private testService: TestService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((param) => {
            this.test_id = param['test_id'];
        });
        this.getTestDetails(this.test_id);
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getTestDetails(id: number): void {
        this.testDetailesSubscription = this.testService
            .getTestDetailes('getTestDetailsByTest', id)
            .subscribe(
                (data: Array<TestDetails>) => {
                    if (data[0]) {
                        this.tests = data;
                        this.dataSource.data = this.tests;
                        this.levels = this.dataSource.data.map((item) =>
                            Number(item.level)
                        );
                        this.getTestRate(this.test_id);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.modalService.showSnackBar(
                            'Деталі тестів завантажено'
                        );
                    } else {
                        this.levels = [];
                    }
                },
                (err) => {
                    this.modalService.showSnackBar(
                        'Сталася помилка при завантаженні деталей тесту'
                    );
                }
            );
    }
    getTestRate(id: number): void {
        this.testDetailesSubscription = this.testService
            .getTestDetailes('getTestRate', id)
            .subscribe(
                (data: TestRate) => {
                    this.testRate = data.testRate;
                },
                (err) => {
                    this.testRate = '0';
                    this.modalService.showSnackBar('Дані відсутні');
                }
            );
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(TestDetailsDialogComponent, {
            width: '600px',
            data: {
                levels: this.levels,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.addTest(result);
        });
    }

    openEditDialog(test: TestDetails): void {
        const dialogRef = this.dialog.open(TestDetailsDialogComponent, {
            width: '600px',
            data: {
                rate: test.rate,
                level: test.level,
                tasks: test.tasks,
                levels: this.levels,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.editTest(result, test.test_id, test.id);
            }
        });
    }

    addTest(test: TestDetails): void {
        const newTest = {
            test_id: this.test_id,
            ...test,
        };
        this.testDetailesSubscription = this.testService
            .createEntity('testDetail', newTest)
            .subscribe((result: TestDetails[]) => {
                this.dataSource.data = this.dataSource.data.concat(result);
                this.getTestRate(this.test_id);
                this.dataSource.paginator.lastPage();
                this.dataSource.paginator = this.paginator;
                this.modalService.showSnackBar('Деталі тестів додано');
            });
    }

    editTest(test: TestDetails, id: number, curId: number): void {
        const newTest = {
            test_id: id,
            ...test,
        };
        this.testDetailesSubscription = this.testService
            .updateEntity('TestDetail', newTest, curId)
            .subscribe((data: TestDetails) => {
                this.getTestRate(this.test_id);
                const newSourse = this.dataSource.data.map((item) => {
                    if (item.id === curId) {
                        return (item = {
                            ...data[0],
                        });
                    } else {
                        return item;
                    }
                });
                this.dataSource.data = newSourse;
                this.modalService.showSnackBar('Деталі тесту оновлено');
            });
    }
    removeTimeTable(test: TestDetails): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: test.test_id,
            },
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.removeTest(test);
            } else {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    removeTest(test: TestDetails): void {
        this.testDetailesSubscription = this.testService
            .deleteEntity('testDetail', test.id)
            .subscribe(
                () => {
                    this.dataSource.data = this.dataSource.data.filter(
                        (t) => t.id !== test.id
                    );
                    this.getTestRate(this.test_id);
                    this.modalService.showSnackBar('Деталі тесту видалено');
                },
                (error) =>
                    this.modalService.showSnackBar('Тест неможливо видалити')
            );
    }

    ngOnDestroy(): void {
        if (this.testDetailesSubscription) {
            this.testDetailesSubscription.unsubscribe();
        }
    }
}
