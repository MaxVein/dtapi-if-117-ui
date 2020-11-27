import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TestService } from './services/test.service';
import { Test } from './models/Test';
import { Subject } from './models/Subject';
import { TestModalComponent } from './test-modal/test-modal.component';
import { ModalService } from './services/modal.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    tests: Test[] = [];
    subjects: Subject[] = [];

    displayedColumns: string[] = [
        'test_id',
        'test_name',
        'subject',
        'tasks',
        'time_for_test',
        'attempts',
        'actions',
    ];

    dataSource = new MatTableDataSource<Test>();

    @ViewChild('table', { static: true }) table: MatTable<Test>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private testService: TestService,
        private modalService: ModalService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getTests().subscribe((data: Test[]) => {
            this.tests = data;
            this.dataSource.data = this.tests;
        });
        this.getSubjects().subscribe(
            (data: Subject[]) => (this.subjects = data)
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getTests(): Observable<Test[]> {
        return this.testService.getEntity('test');
    }

    getSubjects(): Observable<Subject[]> {
        return this.testService.getEntity('subject');
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    openAddDialog(): void {
        const test = {};
        const dialogRef = this.dialog.open(TestModalComponent, {
            width: '600px',
            data: {
                data: test,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.addTest(result);
        });
    }

    openEditDialog(test: Test): void {
        const dialogRef = this.dialog.open(TestModalComponent, {
            width: '600px',
            data: {
                data: test,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.editTest(result);
            }
        });
    }

    getSubjectNameById(subjectId: number): string {
        const subject = this.subjects.find(
            (subjectItem) => subjectItem.subject_id === subjectId
        );

        if (subject) return subject.subject_name;
        return 'Undefined';
    }

    addTest(test: Test): void {
        this.testService
            .createEntity('test', test)
            .subscribe((result: Test[]) => {
                this.tests.push(result[0]);
                this.table.renderRows();
                this.dataSource.paginator = this.paginator;
            });
    }

    editTest(test: Test): void {
        this.testService
            .updateEntity('test', test, test.test_id)
            .subscribe(() => (this.dataSource.data = this.tests));
    }

    removeTest(test: Test): void {
        this.testService.deleteEntity('test', test.test_id).subscribe(
            () =>
                this.modalService.openConfirmModal(
                    'Видалити тест?',
                    () =>
                        (this.dataSource.data = this.dataSource.data.filter(
                            (t) => t.test_id !== test.test_id
                        ))
                ),
            (error) =>
                this.modalService.openErrorModal(
                    'Спочатку видаліть всі деталі тесту'
                )
        );
    }
}
