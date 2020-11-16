import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatPaginator } from '@angular/material/paginator'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'

import { Observable } from 'rxjs'

import { ApiService } from '../api.service'
import { ModalFormComponent } from '../modal-form/modal-form.component'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { DialogService } from '../dialog.service'
import { MatSnackBar } from '@angular/material/snack-bar'

export interface ListTableItem {
    speciality_id?: number
    speciality_code: number
    speciality_name: string
}

@Component({
    selector: 'app-list-table',
    templateUrl: './list-table.component.html',
    styleUrls: ['./list-table.component.scss'],
})
export class ListTableComponent implements OnInit, AfterViewInit {
    dataSource = new MatTableDataSource<ListTableItem>()
    displayedColumns: string[] = ['id', 'name', 'code', 'buttons']
    fileNameDialogRef: MatDialogRef<ModalFormComponent>
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

    constructor(
        private apiService: ApiService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.getSpeciality()
    }
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }

    getSpeciality(): void {
        this.apiService.getEntity('Speciality').subscribe(
            (response: ListTableItem[]) => (this.dataSource.data = response),
            (error) => {
                this.apiService.snackBarOpen()
            }
        )
    }

    openModal(data?: ListTableItem[]): void {
        this.dialogService
            .createModal(data ? data : '')
            .afterClosed()
            .subscribe(
                (res) => (res ? this.getSpeciality() : ''),
                (error) => {
                    this.apiService.snackBarOpen()
                }
            )
    }

    editSpeciality(elem: ListTableItem[]): void {
        this.openModal(elem)
    }

    deleteSpeciality(data: ListTableItem): void {
        this.dialogService
            .openConfirmDialog(data)
            .afterClosed()
            .subscribe(
                (res) => {
                    if (res === 'ok') {
                        this.dataSource.data = this.dataSource.data.filter(
                            (speciality) =>
                                speciality.speciality_id !== data.speciality_id
                        )
                    }
                },
                (error) => {
                    this.apiService.snackBarOpen()
                }
            )
    }
}
