import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator'
import { MatDialog } from '@angular/material/dialog'

import { SubjectsService } from '../subjects.service'
import { ModalComponent } from '../modal/modal.component'

interface SubjectsResponse {
    subject_id: number
    subject_name: string
    subject_description: string
}
interface SubjectsRequest {
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
    public dataSource = new MatTableDataSource<SubjectsResponse>()

    @ViewChild(MatSort) sort: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(
        private subjectsService: SubjectsService,
        public dialog: MatDialog
    ) {
        this.subjectsService.getData('getRecords').subscribe((response) => {
            this.dataSource.data = response
        })
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    public redirectToCreate = (data: SubjectsRequest) => {
        this.subjectsService.create('insertData', data).subscribe()
    }

    public redirectToDetails = (id: string) => {}

    public redirectToUpdate = (id: string, data) => {
        this.subjectsService.update(id, data).subscribe()
    }

    public redirectToDelete = (id: string) => {
        this.subjectsService.delete(id).subscribe()
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            height: '400px',
            width: '500px',
        })

        dialogRef.afterClosed().subscribe((result: SubjectsRequest) => {
            if (result) this.redirectToCreate(result)
        })
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase()
    }
}
