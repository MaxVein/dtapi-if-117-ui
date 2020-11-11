import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { ApiService } from '../api.service'

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

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['id', 'name', 'code']

    constructor(private http: HttpClient, private apiService: ApiService) {}
    ngOnInit() {
        const body = { username: 'admin', password: 'dtapi_admin' }
        this.getSpeciality()
    }
    addSpeciality() {
        // this.http.post('https://dtapi.if.ua/api/Speciality/insertData', {
        //     speciality_name: 'hello 2',
        //     speciality_code: 991,
        // })
    }

    getSpeciality() {
        this.apiService
            .getEntity('Speciality')
            .subscribe(
                (response: ListTableItem[]) => (this.dataSource = response)
            )
    }
}
