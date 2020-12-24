import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../login/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
    Answer,
    Question,
} from '../../../shared/interfaces/student.interfaces';
import { Logged } from '../../../shared/interfaces/auth.interfaces';
import { environment } from '../../../../environments/environment';
import {
    TestLog,
    TestPlayerSaveData,
    ServerTime,
    TestPlayerResponse,
    TestPlayerEndTime,
    TestDetailsByTest,
    QA,
    AnswerData,
    TestResult,
} from '../../../shared/interfaces/test-player.interfaces';

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

    getLog(id: number): Observable<TestLog> {
        return this.authService.isLogged().pipe(
            switchMap((user: Logged) => {
                return this.http.get<TestLog>(
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
                questions.map(({ question_id }) =>
                    this.getTestAnswers(+question_id)
                );
                const answers$ = questions.map(({ question_id, type }) => {
                    if (type === '1' || type === '2') {
                        return this.getTestAnswers(+question_id);
                    } else {
                        return of([]);
                    }
                });
                return forkJoin([of(questions), forkJoin(answers$)]);
            }),
            map(([question, answers]: QA[] | any) => {
                return question.map((question: Question, index: number) => {
                    return {
                        ...question,
                        answers: answers[index].flat(),
                    };
                });
            })
        );
    }

    testPlayerSaveData(
        data: TestPlayerSaveData
    ): Observable<TestPlayerSaveData> {
        return this.http.post<TestPlayerSaveData>(
            `${environment.BASEURL}TestPlayer/saveData`,
            data
        );
    }

    testPlayerGetData(): Observable<TestPlayerResponse> {
        return this.http.get<TestPlayerResponse>(
            `${environment.BASEURL}TestPlayer/getData`
        );
    }

    testPlayerSaveEndTime(
        data: TestPlayerEndTime
    ): Observable<TestPlayerEndTime> {
        return this.http.post<TestPlayerEndTime>(
            `${environment.BASEURL}TestPlayer/saveEndTime`,
            data
        );
    }

    testPlayerGetEndTime(): Observable<TestPlayerEndTime> {
        return this.http.get<TestPlayerEndTime>(
            `${environment.BASEURL}TestPlayer/getEndTime`
        );
    }

    testPlayerResetSession(): Observable<TestPlayerResponse> {
        return this.http.get<TestPlayerResponse>(
            `${environment.BASEURL}TestPlayer/resetSessionData`
        );
    }

    checkDoneTest(answers: AnswerData[]): Observable<TestResult> {
        return this.http.post<TestResult>(
            `${environment.BASEURL}SAnswer/checkAnswers`,
            answers
        );
    }
}
