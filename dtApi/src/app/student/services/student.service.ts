import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { BASE_URL } from '../../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    constructor(private http: HttpClient) {}

    getRecords(entity: string, Id = '') {
        const url = `/${entity}/getRecords/${Id}`
        return this.http.get(`${BASE_URL}${url}`).pipe(map((res) => res[0]))
    }
    getTestDate(id = '') {
        const url = `/Test/getTestsBySubject/${id}`
        return this.http.get(`${BASE_URL}${url}`)
    }
    getTestDetails(groupId, subjectId = '1') {
        const url = `/timeTable/getTimeTableForGroupAndSubject/${groupId}/${subjectId}`
        return this.http.get(`${BASE_URL}${url}`)
    }
}
