import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
    Check,
    Student,
    Unique,
} from '../../../../shared/interfaces/interfaces'
import { Observable } from 'rxjs'
import { environment } from '../../../../../environments/environment'
import { map } from 'rxjs/operators'

@Injectable()
export class StudentsService {
    constructor(private http: HttpClient) {}

    getByGroup(id: number): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${environment.BASEURL}Student/getStudentsByGroup/${id}`
        )
    }

    getById(id: string): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${environment.BASEURL}AdminUser/getRecords/${id}`
        )
    }

    create(student: Student): Observable<Student> {
        return this.http.post<Student>(
            `${environment.BASEURL}Student/insertData`,
            student
        )
    }

    update(id: string, student: Student): Observable<Student> {
        return this.http.patch<Student>(
            `${environment.BASEURL}/Student/update/${id}`,
            student
        )
    }

    remove(id: string): Observable<Response> {
        return this.http.delete<Response>(
            `${environment.BASEURL}/Student/del/${id}`
        )
    }

    check(entity: string, check: string, value: string): Observable<Unique> {
        return this.http
            .get<Check>(`${environment.BASEURL}/${entity}/${check}/${value}`)
            .pipe(
                map((result) => {
                    return result.response
                        ? { propertyIsNotUnique: true }
                        : null
                })
            )
    }
}