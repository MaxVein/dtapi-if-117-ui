import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Student } from '../../interfaces/students/interfaces'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable()
export class StudentsService {
    constructor(private http: HttpClient) {}

    getByGroup(id: number): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${environment.apiURL}/Student/getStudentsByGroup/${id}`
        )
    }

    getById(id: string): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${environment.apiURL}/AdminUser/getRecords/${id}`
        )
    }

    create(student: Student): Observable<Student> {
        return this.http.post<Student>(
            `${environment.apiURL}/Student/insertData`,
            student
        )
    }

    update(id: string, student: Student): Observable<Student> {
        return this.http.patch<Student>(
            `${environment.apiURL}/Student/update/${id}`,
            student
        )
    }

    remove(id: string): Observable<Response> {
        return this.http.delete<Response>(
            `${environment.apiURL}/Student/del/${id}`
        )
    }
}
