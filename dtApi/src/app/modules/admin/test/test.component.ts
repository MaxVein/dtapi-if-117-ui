import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, Observable } from 'rxjs';

import { TestService } from './services/test.service';
import { TestModalComponent } from './test-modal/test-modal.component';
import { ModalService } from 'src/app/shared/services/modal.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ServiceResponse, Test, Subject, DialogData } from './test.interfaces';
import { ConfirmDeleteComponent } from '../groups/confirm-delete/confirm-delete.component';
import { ImportExportDialogComponent } from './import-export-dialog/import-export-dialog.component';

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    tests: Test[] = [];
    subjects: Subject[] = [];
    groupID: number;

    subject_id: string;

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
    testSubscription: Subscription;

    @ViewChild('table', { static: true }) table: MatTable<Test>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private testService: TestService,
        private modalService: ModalService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private router: Router
    ) {}

    ngOnInit() {
        this.groupID = this.route.snapshot.params['id'];
        this.testSubscription = forkJoin({
            tests: this.getTests(this.groupID),
            subjects: this.getSubjects(),
        }).subscribe(
            (res: ServiceResponse) => {
                this.tests = res.tests;
                this.dataSource.data = this.tests;
                this.subjects = res.subjects;
                this.modalService.showSnackBar('Тести завантажено');
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            (err) => {
                this.modalService.showSnackBar(
                    'Cталася помилка при завантаженні тестів'
                );
            }
        );
    }

    getTests(id: number): Observable<Test[]> {
        return this.testService.getTests('test', id);
    }

    getSubjects(): Observable<Subject[]> {
        return this.testService.getEntity('subject');
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }
    openEIDialog(test: Test): void {
        const dialogRef = this.dialog.open(ImportExportDialogComponent, {
            width: '600px',
            data: {
                test_id: test.test_id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
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
                this.editTest(result, test.test_id);
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
        this.testSubscription = this.testService
            .createEntity('test', test)
            .subscribe((result: Test[]) => {
                this.dataSource.data = this.dataSource.data.concat(result);
                this.dataSource.paginator.lastPage();
                this.modalService.showSnackBar('Тест додано');
            });
    }

    editTest(test: Test, id: number): void {
        this.testSubscription = this.testService
            .updateEntity('test', test, id)
            .subscribe((data: Test) => {
                const newSourse = this.dataSource.data.map((item) => {
                    if (item.test_id === id) {
                        return (item = {
                            ...data[0],
                        });
                    } else {
                        return item;
                    }
                });
                this.dataSource.data = newSourse;
                this.modalService.showSnackBar('Тест змінено');
            });
    }

    redirectToDelete(test: Test): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: test.test_name,
            },
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.removeTest(test.test_id);
            } else {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    removeTest(id: number): void {
        this.testSubscription = this.testService
            .deleteEntity('test', id)
            .subscribe(
                () => {
                    this.dataSource.data = this.dataSource.data.filter(
                        (t) => t.test_id !== id
                    );
                    this.modalService.showSnackBar('Тест видалено');
                },
                (error) =>
                    this.modalService.showSnackBar('Тест неможливо видалити')
            );
    }
    public redirectToTestDetail(id: string) {
        this.router.navigate([`admin/subjects/tests/${id}/test-detailes`], {
            queryParams: {
                test_id: id,
            },
        });
    }
    navigateToTestQuestions(id: number): void {
        this.router.navigate([`admin/subjects/tests/${id}/questions`]);
    }
    ngOnDestroy(): void {
        if (this.testSubscription) {
            this.testSubscription.unsubscribe();
        }
    }
}
