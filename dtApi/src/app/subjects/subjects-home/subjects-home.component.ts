import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator'

import { SubjectsService } from '../subjects.service'

interface Subjects {
    subject_id: number
    subject_name: string
    subject_description: string
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
        'details',
        'update',
        'delete',
    ]
    public dataSource = new MatTableDataSource<Subjects>()
    //TEMPORARY DATA____createData
    public createData = {
        subject_name: 'Тест створення_12_11_2020',
        subject_description: 'Дескріпшин',
    }
    //TEMPORARY DATA____updatedData
    public updatedData = {
        subject_name: 'Природознавство',
        subject_description: 'Пізнавайте природу та бережіть її',
    }

    @ViewChild(MatSort) sort: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(private subjectsService: SubjectsService) {
        this.subjectsService.getData('getRecords').subscribe((response) => {
            this.dataSource.data = response
        })
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    public redirectToCreate = (data: {
        subject_name: string
        subject_description: string
    }) => {
        this.subjectsService.create('insertData', data).subscribe()
    }

    public redirectToDetails = (id: string) => {}

    public redirectToUpdate = (id: string, data) => {
        this.subjectsService.update(id, data).subscribe()
    }

    public redirectToDelete = (id: string) => {
        this.subjectsService.delete(id).subscribe()
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase()
    }
}
