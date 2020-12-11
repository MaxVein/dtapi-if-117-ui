import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
    Answer,
    Log,
    QA,
    Question,
    ServerTime,
    TestDetailsByTest,
    TestPlayerEndTime,
    TestPlayerSaveData,
} from '../../../shared/interfaces/student.interfaces';
import { Logged } from '../../../shared/interfaces/auth.interfaces';
import { Response } from '../../../shared/interfaces/entity.interfaces';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TestPlayerService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getTestDetailsByTest(id: number): Observable<TestDetailsByTest[]> {
        return this.http.get<TestDetailsByTest[]>(
            `${environment.BASEURL}testDetail/getTestDetailsByTest/${id}`
        );
    }

    getQuestionByLevel(
        id: number,
        level: number,
        task: number
    ): Observable<Question[]> {
        return this.http.get<Question[]>(
            `${environment.BASEURL}Question/getQuestionIdsByLevelRand/${id}/${level}/${task}`
        );
    }

    getServerTime(): Observable<ServerTime> {
        return this.http.get<ServerTime>(
            `${environment.BASEURL}TestPlayer/getTimeStamp`
        );
    }

    getLog(id: number): Observable<Log> {
        return this.authService.isLogged().pipe(
            switchMap((user: Logged) => {
                return this.http.get<Log>(
                    `${environment.BASEURL}Log/startTest/${user.id}/${id}`
                );
            })
        );
    }

    getAllQuestions(ids: Array<string>): Observable<Question[]> {
        return this.http.post<Question[]>(
            `${environment.BASEURL}EntityManager/getEntityValues`,
            { entity: 'Question', ids: ids }
        );
    }

    getTestAnswers(id: number): Observable<Answer[]> {
        return this.http.get<Answer[]>(
            `${environment.BASEURL}SAnswer/getAnswersByQuestion/${+id}`
        );
    }

    getAllQuestionsDataForTest(id: number): Observable<QA[]> {
        return this.getTestDetailsByTest(id).pipe(
            switchMap((testDetails: TestDetailsByTest[]) => {
                const questionsByLevel$ = testDetails.map(({ level, tasks }) =>
                    this.getQuestionByLevel(id, level, tasks)
                );
                return forkJoin(questionsByLevel$);
            }),
            switchMap((questionsByLevel: Question[][] | any) => {
                return this.getAllQuestions(
                    questionsByLevel
                        .flat()
                        .map(({ question_id }) => question_id)
                );
            }),
            switchMap((questions: Question[] | any) => {
                const answers$ = questions.map(({ question_id }) =>
                    this.getTestAnswers(+question_id)
                );
                return forkJoin([of(questions), forkJoin(answers$)]);
            }),
            map(([question, answers]: QA[] | any) => {
                return question.map((question: Question) => {
                    return {
                        ...question,
                        answers: answers.flat(),
                    };
                });
            })
        );
    }

    testPlayerSaveData(
        id: number,
        testInProgress: boolean
    ): Observable<Response> {
        return this.http.post<Response>(
            `${environment.BASEURL}TestPlayer/saveData`,
            { id, progress: testInProgress }
        );
    }

    testPlayerGetData(): Observable<TestPlayerSaveData> {
        return this.http.get<TestPlayerSaveData>(
            `${environment.BASEURL}TestPlayer/getData`
        );
    }

    testPlayerSaveEndTime(end: TestPlayerEndTime): Observable<Response> {
        return this.http.post<Response>(
            `${environment.BASEURL}TestPlayer/saveEndTime`,
            end
        );
    }

    testPlayerGetEndTime(): Observable<TestPlayerEndTime> {
        return this.http.get<TestPlayerEndTime>(
            `${environment.BASEURL}TestPlayer/getEndTime`
        );
    }

    testPlayerResetSession(): Observable<Response> {
        return this.http.get<Response>(
            `${environment.BASEURL}TestPlayer/resetSessionData`
        );
    }

    checkDoneTest(test: any): Observable<any> {
        return this.http.post<any>(
            `${environment.BASEURL}SAnswer/checkAnswers`,
            test
        );
    }
}
