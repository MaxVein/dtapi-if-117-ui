import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

const A_THOUSAND = 1000;
const A_MINUTE_TO_SEC = 60;
const DAY_BY_HOURS = 24;

@Injectable({
    providedIn: 'root',
})
export class ResultsService {
    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    getGroupList(): Observable<any> {
        return this.http.get(`${environment.BASEURL}group/getRecords`);
    }
    getTestsList(): Observable<any> {
        return this.http.get(`${environment.BASEURL}test/getRecords`);
    }

    snackBarOpen(): any {
        return this.snackBar.open('Щось пішло не так:(', '', {
            duration: 1500,
        });
    }
    getResultTestIdsByGroup(group_id): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}Result/getResultTestIdsByGroup/${group_id}`
        );
    }
    getStudentInfo(id): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}Student/getStudentsByGroup/${id}`
        );
    }
    getRecordsByTestDate(testId, groupId): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}Result/getRecordsByTestGroupDate/${testId}/${groupId}`
        );
    }
    getDuration(session_date, start_time, end_time) {
        const startTime = Date.parse(`${session_date} ${start_time}`);
        const endTime = Date.parse(`${session_date} ${end_time}`);
        const duration = endTime - startTime;
        return this.msToTime(duration);
    }
    private msToTime(duration: number) {
        let seconds: number | string = Math.floor(
                (duration / A_THOUSAND) % A_MINUTE_TO_SEC
            ),
            minutes: number | string = Math.floor(
                (duration / (A_THOUSAND * A_MINUTE_TO_SEC)) % A_MINUTE_TO_SEC
            ),
            hours: number | string = Math.floor(
                (duration / (A_THOUSAND * A_MINUTE_TO_SEC * A_MINUTE_TO_SEC)) %
                    DAY_BY_HOURS
            );

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${hours}:${minutes}:${seconds}`;
    }

    getByEntityManager(
        entity: string,
        idsList: Array<number>
    ): Observable<any> {
        const data = {
            entity: entity,
            ids: idsList,
        };
        return this.http.post(
            `${environment.BASEURL}EntityManager/getEntityValues`,
            data
        );
    }
    getAnswersByQuestions(id): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}answer/getAnswersByQuestion/${id}`
        );
    }
}
