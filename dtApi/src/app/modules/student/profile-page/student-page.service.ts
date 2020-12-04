import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    constructor(private http: HttpClient) {}
    currentTime;
    endTimeTest;

    getRecords(entity: string, Id = '') {
        const url = `${entity}/getRecords/${Id}`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    getTestBySubject(id = '') {
        const url = `test/getTestsBySubject/${id}`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    getTestDetails(groupId: string, subjectId = '') {
        const url = `timeTable/getTimeTableForGroupAndSubject/${groupId}/${subjectId}`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    checkPosibilityOfTest(studentId: string, testId: string) {
        const url = `Log/startTest/${studentId}/${testId}`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    timer(testDuration) {
        const url = `TestPlayer/getTimeStamp`;
        const serverTimeStamp$ = this.http.get(`${environment.BASEURL}${url}`);
        serverTimeStamp$
            .pipe(
                concatMap(
                    (res: any): Observable<any> => {
                        this.currentTime = res.unix_timestamp;
                        this.endTimeTest = this.currentTime + testDuration * 60;
                        return this.saveEndTimeTest(this.endTimeTest);
                    }
                )
            )
            .subscribe((res) => {
                this.createInterval(this.currentTime);
            });
    }
    saveEndTimeTest(endTime) {
        const url = `TestPlayer/saveEndTime`;
        return this.http.post(`${environment.BASEURL}${url}`, endTime);
    }
    endTime() {
        const url = `TestPlayer/getEndTime`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    resetSessionData() {
        const url = `TestPlayer/resetSessionData`;
        const endTimeRequest$ = this.http.get(`${environment.BASEURL}${url}`);
        endTimeRequest$.subscribe((res) => {
            // console.log(res);
            //this.checkAnswers();
        });
    }
    createInterval(currentTime) {
        const endTestServerTime$ = this.endTime();
        endTestServerTime$.subscribe((res: number) => {
            let diffTime = new Date((res - currentTime) * 1000).getTime();
            const interval = setInterval(() => {
                const hours = Math.floor(
                    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (diffTime % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                diffTime -= 1000;
                document.getElementById('timer').innerHTML = ` ${
                    hours === 0 ? '00' : hours
                } : ${minutes < 10 ? '0' + minutes : minutes} : ${
                    seconds < 10 ? '0' + seconds : seconds
                }`;
                if (diffTime < 0) {
                    clearInterval(interval);
                    document.getElementById('timer').innerHTML = 'EXPIRED';
                }
            }, 1000);
        });
    }
    checkAnswers() {
        const url = `SAnswer/checkAnswers`;
        this.http
            .post(`${environment.BASEURL}${url}`, {
                question_id: 16,
                answer_ids: [21],
            })
            .subscribe((res) => {
                //console.log(res);
            });
    }
}
