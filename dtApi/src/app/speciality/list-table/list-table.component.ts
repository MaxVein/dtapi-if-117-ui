import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { ApiService } from '../api.service'
import { ModalFormComponent } from '../modal-form/modal-form.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

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
export class ListTableComponent implements OnInit {
    dataSource: ListTableItem[]
    displayedColumns = ['id', 'name', 'code']

    fileNameDialogRef: MatDialogRef<ModalFormComponent>

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.getSpeciality()
    }

    getSpeciality(): any {
        this.apiService
            .getEntity('Speciality')
            .subscribe(
                (response: ListTableItem[]) => (this.dataSource = response)
            )
    }

    openModal() {
        this.fileNameDialogRef = this.dialog.open(ModalFormComponent, {
            disableClose: true,
        })

        this.fileNameDialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed')
        })
    }
}
