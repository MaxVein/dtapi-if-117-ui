import { Component, ViewChild, OnInit } from '@angular/core'

import { TestService } from './services/test.service'
import { Test } from './models/Test'
import { TestModalComponent } from './test-modal/test-modal.component'

import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatDialog } from '@angular/material/dialog'

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    tests: Test[] = []
    test: Test

    displayedColumns: string[] = [
        'test_id',
        'test_name',
        'subject_id',
        'tasks',
        'time_for_test',
        'attempts',
        'actions',
    ]
    dataSource = new MatTableDataSource<Test>()

    @ViewChild('table', { static: true }) table: MatTable<Test>
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
    @ViewChild(MatSort, { static: true }) sort: MatSort

    constructor(private testService: TestService, public dialog: MatDialog) {
        this.testService.getEntity('test').subscribe((data: Test[]) => {
            this.dataSource.data = data
        })
    }

    ngOnInit() {
        this.tests = []
        this.dataSource.data = this.tests
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
    }

    getTests(): any {
        this.testService.getEntity('test').subscribe((data: Test[]) => {
            this.dataSource.data = data
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }

    openAddDialog() {
        const test = {}
        const dialogRef = this.dialog.open(TestModalComponent, {
            width: '600px',
            data: {
                data: test,
            },
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.addTest(result)
        })
    }

    addTest(test: Test) {
        this.testService
            .createEntity('test', test)
            .subscribe((result: Test[]) => {
                this.tests.push(result[0])
                this.table.renderRows()
                this.dataSource.paginator = this.paginator
            })
    }

    editTest(test: any) {
        const dialogRef = this.dialog.open(TestModalComponent, {
            width: '600px',
            data: {
                data: test,
            },
        })
        dialogRef.afterClosed().subscribe((data: Test) => {
            if (data) {
                data.test_id = test.test_id
                return this.testService.updateEntity('test', data, test.test_id)
            }
            this.getTests()
        })
    }

    removeTest(obj: Test) {
        this.testService.deleteEntity('test', obj.test_id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
                (test) => test.test_id !== obj.test_id
            )
        })
    }
}
