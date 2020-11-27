import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Check,
    Faculty,
    Group,
    Response,
    Speciality,
    Student,
    StudentInfo,
    Unique,
} from '../../../shared/interfaces/interfaces';
import { environment } from '../../../../environments/environment';

@Injectable()
export class StudentsService {
    constructor(private http: HttpClient) {}

    getByGroup(id: number, notPhotos?: boolean): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${environment.BASEURL}Student/getStudentsByGroup/${id}/${
                notPhotos ? 'withoutPhoto' : ''
            }`
        );
    }

    getById(entity: string, id: string): Observable<Student[] | StudentInfo[]> {
        return this.http.get<Student[] | StudentInfo[]>(
            `${environment.BASEURL}${entity}/getRecords/${id}`
        );
    }

    create(student: Student): Observable<Student> {
        return this.http.post<Student>(
            `${environment.BASEURL}Student/insertData`,
            student
        );
    }

    update(id: string, student: Student): Observable<Student> {
        return this.http.patch<Student>(
            `${environment.BASEURL}Student/update/${id}`,
            student
        );
    }

    remove(id: string): Observable<any> {
        return this.http.delete<Response>(
            `${environment.BASEURL}Student/del/${id}`
        );
    }

    check(entity: string, check: string, value: string): Observable<Unique> {
        return this.http
            .get<Check>(`${environment.BASEURL}${entity}/${check}/${value}`)
            .pipe(
                map((result) => {
                    return result.response
                        ? { propertyIsNotUnique: true }
                        : null;
                })
            );
    }

    getGroupData(id: number): Observable<Group[]> {
        return this.http.get<Group[]>(
            `${environment.BASEURL}Group/getRecords/${id}`
        );
    }

    getFacultyData(id: string): Observable<Faculty[]> {
        return this.http.get<Faculty[]>(
            `${environment.BASEURL}Faculty/getRecords/${id}`
        );
    }

    getSpecialityData(id: string): Observable<Speciality[]> {
        return this.http.get<Speciality[]>(
            `${environment.BASEURL}Speciality/getRecords/${id}`
        );
    }

    getEntityFaculty(): Observable<Faculty[]> {
        return this.http.get<Faculty[]>(
            `${environment.BASEURL}Faculty/getRecords`
        );
    }

    getEntityGroupsByFaculty(id: string): Observable<Group[]> {
        return this.http.get<Group[]>(
            `${environment.BASEURL}group/getGroupsByFaculty/${id}`
        );
    }
}
