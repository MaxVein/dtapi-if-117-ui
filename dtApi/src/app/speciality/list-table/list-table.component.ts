import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { ApiService } from '../api.service'
import { IsNumValidators } from '../isnum.validators'

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

    form: FormGroup

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['id', 'name', 'code']

    constructor(private http: HttpClient, private apiService: ApiService) {}
    ngOnInit() {
        const body = { username: 'admin', password: 'dtapi_admin' }
        this.getSpeciality()

        this.form = new FormGroup({
            speciality_name: new FormControl('', Validators.required),
            speciality_code: new FormControl('', [
                Validators.required,
                Validators.maxLength(5),
                IsNumValidators.isNum,
            ]),
        })
    }
    addSpeciality() {
        if (this.form.valid) {
            this.apiService
                .addEntity('Speciality', this.form.value)
                .subscribe((response) => response)
        }
    }

    getSpeciality() {
        this.apiService
            .getEntity('Speciality')
            .subscribe(
                (response: ListTableItem[]) => (this.dataSource = response)
            )
    }
}
