import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Faculty } from '../../../../shared/interfaces/entity.interfaces';
import { ApiService } from '../../../../shared/services/api.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../dialog.service';

@Component({
    selector: 'app-faculties-list',
    templateUrl: './faculties-list.component.html',
    styleUrls: ['./faculties-list.component.scss'],
})
export class FacultiesListComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<Faculty>();
    displayedColumns: string[] = ['id', 'name', 'description', 'buttons'];
    fileNameDialogRef: MatDialogRef<ModalFormComponent>;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private apiService: ApiService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.getFaculty();
    }
    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
    }
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    getFaculty(): void {
        this.apiService.getEntity('Faculty').subscribe(
            (response: Faculty[]) => (this.dataSource.data = response),
            (error) => {
                this.apiService.snackBarOpen();
            }
        );
    }

    openModal(data?: Faculty[]): void {
        this.dialogService
            .createModal(data ? data : '')
            .afterClosed()
            .subscribe(
                (res) => (res ? this.getFaculty() : ''),
                (error) => {
                    this.apiService.snackBarOpen();
                }
            );
    }

    editFaculty(elem: Faculty[]): void {
        this.openModal(elem);
    }

    deleteFaculty(data: Faculty): void {
        this.dialogService
            .openConfirmDialog(data)
            .afterClosed()
            .subscribe(
                (res) => {
                    if (res === 'ok') {
                        this.dataSource.data = this.dataSource.data.filter(
                            (Faculty) => Faculty.faculty_id !== data.faculty_id
                        );
                    }
                },
                (error) => {
                    this.apiService.snackBarOpen();
                }
            );
    }
}
