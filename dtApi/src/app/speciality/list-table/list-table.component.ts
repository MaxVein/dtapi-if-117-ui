import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../api.service'
import { ModalFormComponent } from '../modal-form/modal-form.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { DialogService } from '../dialog.service'

export interface ListTableItem {
    speciality_id: number
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
        private http: HttpClient,
        private apiService: ApiService,
        private dialogService: DialogService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getSpeciality()
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
    }

    getSpeciality(): Observable<ListTableItem> {
        return this.apiService
            .getEntity('Speciality')
            .subscribe(
                (response: ListTableItem[]) => (this.dataSource.data = response)
            )
    }

    openModal(data?) {
        this.fileNameDialogRef = this.dialog.open(ModalFormComponent, {
            data: data ? data : '',
            autoFocus: true,
            disableClose: true,
        })

        this.fileNameDialogRef.afterClosed().subscribe((result) => {
            this.getSpeciality()
        })
    }

    editSpeciality(elem) {
        this.openModal(elem)
    }

    deleteSpeciality(data: ListTableItem) {
        this.dialogService
            .openConfirmDialog(data)
            .afterClosed()
            .subscribe((res) => {
                if (res === 'ok') {
                    this.dataSource.data = this.dataSource.data.filter(
                        (speciality) =>
                            speciality.speciality_id !== data.speciality_id
                    )
                }
            })
    }
}
