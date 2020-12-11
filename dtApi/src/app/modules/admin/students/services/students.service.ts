import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
    Check,
    Faculty,
    Group,
    Response,
    Speciality,
    Student,
    StudentInfo,
    StudentProfileData,
    Unique,
} from '../../../../shared/interfaces/entity.interfaces';
import { environment } from '../../../../../environments/environment';

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

    getStudentDataForUpdate(id: string): Observable<StudentProfileData> {
        const studentUpdateData: StudentProfileData[] = [];
        return this.getById('Student', id).pipe(
            switchMap((student: Student[]) => {
                studentUpdateData.push(student[0]);
                return this.getById('AdminUser', id);
            }),
            switchMap((studentInfo: StudentInfo[]) => {
                studentUpdateData[0].username = studentInfo[0].username;
                studentUpdateData[0].email = studentInfo[0].email;
                return studentUpdateData;
            })
        );
    }

    getAllStudentData(
        studentID: string,
        groupID: number
    ): Observable<StudentProfileData> {
        const studentData: StudentProfileData[] = [];
        return this.getById('Student', studentID).pipe(
            switchMap((student: Student[]) => {
                studentData.push(student[0]);
                return this.getById('AdminUser', studentID);
            }),
            map((res: StudentInfo[]) => res[0]),
            switchMap((studentInfo: StudentInfo) => {
                studentData[0].username = studentInfo.username;
                studentData[0].email = studentInfo.email;
                return this.getGroupData(groupID);
            }),
            map((res: Group[]) => res[0]),
            switchMap((group: Group) => {
                studentData[0].group_name = group.group_name;
                studentData[0].speciality_id = group.speciality_id;
                return this.getFacultyData(group.faculty_id);
            }),
            map((res: Faculty[]) => res[0]),
            switchMap((faculty: Faculty) => {
                studentData[0].faculty_name = faculty.faculty_name;
                return this.getSpecialityData(studentData[0].speciality_id);
            }),
            map((res: Speciality[]) => res[0]),
            switchMap((speciality: Speciality) => {
                studentData[0].speciality_code = speciality.speciality_code;
                studentData[0].speciality_name = speciality.speciality_name;
                return studentData;
            })
        );
    }
}
