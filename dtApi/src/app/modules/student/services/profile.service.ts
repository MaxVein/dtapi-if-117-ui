import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import {
    StudentProfile,
    TestDate,
    TestDetails,
} from '../../../shared/interfaces/student.interfaces';
import { environment } from 'src/environments/environment';
import {
    Faculty,
    Group,
    Response,
    Speciality,
    Student,
} from '../../../shared/interfaces/entity.interfaces';
import { Logged } from '../../../shared/interfaces/auth.interfaces';

@Injectable()
export class ProfileService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getRecords(entity: string, id: string | number = ''): Observable<any> {
        return this.http.get<any>(
            `${environment.BASEURL}${entity}/getRecords/${id}`
        );
    }

    getTestDate(id: string): Observable<TestDetails[]> {
        return this.http.get<TestDetails[]>(
            `${environment.BASEURL}test/getTestsBySubject/${id}`
        );
    }

    getTestDetails(group_id: number): Observable<any> {
        return this.http.get<TestDate[]>(
            `${environment.BASEURL}timeTable/getTimeTablesForGroup/${group_id}`
        );
    }

    testPlayerGetTest(id: string): Observable<Response> {
        return this.http.get<Response>(
            `${environment.BASEURL}TestPlayer/getTest/${id}`
        );
    }

    getAllStudentData(): Observable<StudentProfile> {
        const studentData: StudentProfile[] = [];
        return this.authService.isLogged().pipe(
            switchMap((response: Logged) => {
                return this.getRecords('Student', response.id);
            }),
            map((res) => res[0]),
            switchMap((student: Student) => {
                studentData.push(student);
                return this.getRecords('Group', student.group_id);
            }),
            map((res) => res[0]),
            switchMap((group: Group) => {
                studentData[0].group_name = group.group_name;
                studentData[0].speciality_id = group.speciality_id;
                return this.getRecords('Faculty', group.faculty_id);
            }),
            map((res) => res[0]),
            switchMap((faculty: Faculty) => {
                studentData[0].faculty_name = faculty.faculty_name;
                studentData[0].faculty_id = faculty.faculty_id;
                return this.getRecords(
                    'Speciality',
                    studentData[0].speciality_id
                );
            }),
            map((res) => res[0]),
            switchMap((speciality: Speciality) => {
                studentData[0].speciality_code = speciality.speciality_code;
                studentData[0].speciality_name = speciality.speciality_name;
                return studentData;
            })
        );
    }
}
