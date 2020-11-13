import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

import { TestService } from './services/test.service'
import { Test } from './models/Test'

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements AfterViewInit {
    displayedColumns: string[] = [
        'test_id',
        'test_name',
        'subject_id',
        'tasks',
        'time_for_test',
        'attempts',
    ]
    dataSource = new MatTableDataSource<Test>()

    @ViewChild(MatSort) sort: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(private testService: TestService) {
        this.testService.login().subscribe((data: Test[]) => {
            console.log(data)
        })
        this.testService.getEntity('test').subscribe((data: Test[]) => {
            this.dataSource.data = data
        })
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }
}
