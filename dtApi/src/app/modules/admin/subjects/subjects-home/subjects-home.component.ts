import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { SubjectsService } from '../subjects.service';
import { ModalComponent } from '../modal/modal.component';

interface SubjectsResponse {
    subject_id: number;
    subject_name: string;
    subject_description: string;
}
interface SubjectsRequest {
    subject_name: string;
    subject_description: string;
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
        'operations',
    ];
    public dataSource = new MatTableDataSource<SubjectsResponse>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private subjectsService: SubjectsService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getSubjects();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    public getSubjects() {
        this.subjectsService
            .getData()
            .subscribe((response) => (this.dataSource.data = response));
    }

    public redirectToCreate = (data: SubjectsRequest) => {
        this.subjectsService.create(data).subscribe();
    };

    public redirectToUpdate = (id: number, body: SubjectsResponse) => {
        this.subjectsService.update(id, body).subscribe();
    };

    public redirectToDelete = (id: number) => {
        this.subjectsService.delete(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
                (item) => item.subject_id !== id
            );
        });
    };

    public onCreate(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '300px',
        });

        dialogRef.afterClosed().subscribe((result: SubjectsRequest) => {
            if (result) {
                const updResult = { ...result };
                for (const k in updResult) {
                    if (!updResult[k]) delete updResult[k];
                }
                this.redirectToCreate(updResult);
                this.getSubjects();
            }
        });
    }

    public onEdit(element: SubjectsResponse): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '300px',
            data: element,
        });

        dialogRef.afterClosed().subscribe((result: SubjectsResponse) => {
            if (result) {
                this.redirectToUpdate(result.subject_id, result);
                this.getSubjects();
            }
        });
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    };
}
