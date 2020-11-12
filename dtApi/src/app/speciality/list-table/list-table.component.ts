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

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getSpeciality()
    }
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }

    getSpeciality(): Observable<ListTableItem> {
        return this.apiService
            .getEntity('Speciality')
            .subscribe(
                (response: ListTableItem[]) => (this.dataSource.data = response)
            )
    }

    openModal(): void {
        this.fileNameDialogRef = this.dialog.open(ModalFormComponent, {
            disableClose: true,
        })

        this.fileNameDialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed')
        })
    }
    deleteSpeciality(elem: ListTableItem): Observable<any> {
        return this.apiService
            .delEntity('Speciality', elem.speciality_id)
            .subscribe((res) => {
                this.dataSource.data.filter(
                    (speciality) =>
                        speciality.speciality_id !== elem.speciality_id
                )
                this.getSpeciality()
            })
    }
    editSpeciality(elem): void {}
}
