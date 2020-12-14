import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { typeReverse } from './Question';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private entity = 'Question';
    constructor(private httpInstance: HttpClient) {}

    getQuestions(id: number, quantity: number): Observable<any> {
        return this.httpInstance
            .get(
                `${environment.BASEURL}${this.entity}/getRecordsRangeByTest/${id}/${quantity}/0/wi`
            )
            .pipe(
                map((arr: any[]) => {
                    const newarr = arr.map((item) => {
                        return {
                            question_id: item.question_id,
                            question_text: item.question_text,
                            type: typeReverse(item.type),
                            level: item.level,
                        };
                    });
                    return newarr;
                })
            );
    }
    getNumberOfQuestions(id: number): Observable<any> {
        return this.httpInstance
            .get(
                `${environment.BASEURL}${this.entity}/countRecordsByTest/${id}`
            )
            .pipe(pluck('numberOfRecords'));
    }
    addQuestion(body: string): Observable<any> {
        return this.httpInstance.post(
            `${environment.BASEURL}${this.entity}/insertData`,
            body
        );
    }
    deleteAnswerCollection(answers: any): Observable<any> {
        const deleteAnswerObservables = answers.map((answer) =>
            this.httpInstance.delete(
                `${environment.BASEURL}answer/del/` + answer.answer_id
            )
        );
        return forkJoin(deleteAnswerObservables);
    }
    updateQuestion(body: string, id: string | number): Observable<any> {
        return this.httpInstance.post(
            `${environment.BASEURL}${this.entity}/update/${id}`,
            body
        );
    }
    deleteQuestion(id: number): Observable<any> {
        return this.httpInstance.delete(
            `${environment.BASEURL}${this.entity}/del/${id}`
        );
    }
}
