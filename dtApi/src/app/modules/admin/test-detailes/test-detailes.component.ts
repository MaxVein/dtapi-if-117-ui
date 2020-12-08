import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TestService } from '../test/services/test.service';
import { ModalService } from '../test/services/modal.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TestDetailsDialogComponent } from './test-details-dialog/test-details-dialog.component';

export interface TestDetails {
    test_id: any;
    id: any;
    level: string;
    tasks: string;
    rate: string;
}

@Component({
    selector: 'app-test-detailes',
    templateUrl: './test-detailes.component.html',
    styleUrls: ['./test-detailes.component.scss'],
})
export class TestDetailesComponent implements OnInit {
    tests: TestDetails[] = [];
    test_id: any;
    testRate: string;

    displayedColumns: string[] = ['id', 'level', 'tasks', 'rate', 'actions'];

    dataSource = new MatTableDataSource<TestDetails>();

    @ViewChild('table', { static: true }) table: MatTable<TestDetails>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private testService: TestService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((param) => {
            this.test_id = param['test_id'];
        });
        this.getTestDetails(this.test_id).subscribe(
            (data) => {
                this.tests = data;
                this.dataSource.data = this.tests;
            },
            (err) => {}
        );
        this.getTestRate(this.test_id).subscribe(
            (data) => {
                this.testRate = data.testRate;
                this.dataSource.data = this.tests;
            },
            (err) => {}
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getTestDetails(id: number): Observable<TestDetails[]> {
        return this.testService.getTestDetailes('getTestDetailsByTest', id);
    }
    getTestRate(id: number): Observable<any> {
        return this.testService.getTestDetailes('getTestRate', id);
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    openAddDialog(): void {
        let levels = this.dataSource.data.map((item) => Number(item.level));
        const dialogRef = this.dialog.open(TestDetailsDialogComponent, {
            width: '600px',
            data: {
                levels: levels,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.addTest(result, result.id);
        });
    }

    openEditDialog(test: TestDetails): void {
        let levels = this.dataSource.data.map((item) => Number(item.level));
        const dialogRef = this.dialog.open(TestDetailsDialogComponent, {
            width: '600px',
            data: {
                rate: test.rate,
                level: test.level,
                tasks: test.tasks,
                levels: levels,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.editTest(result, test.test_id, test.id);
            }
        });
    }

    addTest(test: TestDetails, id): void {
        const newTest = {
            test_id: this.test_id,
            ...test,
        };
        this.testService
            .createEntity('testDetail', newTest)
            .subscribe((result: TestDetails[]) => {
                this.dataSource.data = this.dataSource.data.concat(result);
                this.dataSource.paginator.lastPage();
                this.dataSource.paginator = this.paginator;
            });
    }

    editTest(test: TestDetails, id: any, curId: any): void {
        const newTest = {
            test_id: id,
            ...test,
        };
        this.testService
            .updateEntity('TestDetail', newTest, curId)
            .subscribe((data: TestDetails) => {
                this.dataSource.data = this.dataSource.data.concat(data);
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
            });
    }

    removeTest(test: TestDetails): void {
        this.testService.deleteEntity('testDetail', test.id).subscribe(
            () => {
                this.modalService.openConfirmModal(
                    'Видалити тест?',
                    () =>
                        (this.dataSource.data = this.dataSource.data.filter(
                            (t) => t.id !== test.id
                        ))
                );
            },
            (error) =>
                this.modalService.openErrorModal(
                    'Спочатку видаліть всі деталі тесту'
                )
        );
    }
}
