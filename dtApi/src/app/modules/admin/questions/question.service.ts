import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
                        switch (item.type) {
                            case '1':
                                item.type = 'Простий вибір';
                                break;
                            case '2':
                                item.type = 'Мульти вибір';
                                break;
                            case '3':
                                item.type = 'Текстовий';
                                break;
                        }
                        return {
                            question_id: item.question_id,
                            question_text: item.question_text,
                            type: item.type,
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
    updateQuestion(body: string, id: string): Observable<any> {
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
