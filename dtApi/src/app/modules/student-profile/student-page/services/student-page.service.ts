import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    constructor(private http: HttpClient) {}

    getRecords(entity: string, Id = '') {
        const url = `${entity}/getRecords/${Id}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
    getTestDate(id = '') {
        const url = `test/getTestsBySubject/${id}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
    getTestDetails(subjectId = '') {
        const url = `timeTable/getTimeTablesForSubject/${subjectId}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
}
