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
    getTestBySubject(id = '') {
        const url = `test/getTestsBySubject/${id}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
    getTestDetails(groupId: string, subjectId = '') {
        const url = `timeTable/getTimeTableForGroupAndSubject/${groupId}/${subjectId}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
    checkPosibilityOfTest(studentId: string, testId: string) {
        const url = `Log/startTest/${studentId}/${testId}`
        return this.http.get(`${environment.BASEURL}${url}`)
    }
}
