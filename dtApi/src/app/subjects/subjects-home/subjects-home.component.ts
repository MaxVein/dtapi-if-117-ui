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
        'update',
        'delete',
    ]
    public dataSource = new MatTableDataSource<SubjectsResponse>();
    public singleRecordData: SubjectsResponse;

    @ViewChild(MatSort) sort: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(
        private subjectsService: SubjectsService,
        public dialog: MatDialog
    ) {
        this.getSubjects();
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    public getSubjects() {
        this.subjectsService.getData().subscribe((response) => this.dataSource.data = response)
    }

    public redirectToCreate = (data: SubjectsRequest) => {
        this.subjectsService.create(data).subscribe()
    }

    public redirectToUpdate = (id: number, body: any) => {
        this.subjectsService.update(id, body).subscribe()
    }

    public redirectToDelete = (id: number) => {
        this.subjectsService.delete(id).subscribe()
    }

    public onCreate(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            height: '400px',
            width: '500px',
        })

           dialogRef.afterClosed().subscribe((result: SubjectsResponse) => {
            if (result) {
                    this.redirectToCreate(result)
            }
        })
    }

    public onEdit(element: SubjectsResponse): void {

        const dialogRef = this.dialog.open(ModalComponent, {
            height: '400px',
            width: '500px',
            data: element
        })

           dialogRef.afterClosed().subscribe((result: SubjectsResponse) => {
            if (result) {
                this.redirectToUpdate(result.subject_id, result);
                this.getSubjects()
            }
        })
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase()
    }
}
