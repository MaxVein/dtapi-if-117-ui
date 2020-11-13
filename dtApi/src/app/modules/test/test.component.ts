import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'

import { TestService } from './services/test.service'
import { Test } from './models/Test'
import { MatSort } from '@angular/material/sort'

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, AfterViewInit {
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

    ngOnInit() {}
    ngAfterViewInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }
}
