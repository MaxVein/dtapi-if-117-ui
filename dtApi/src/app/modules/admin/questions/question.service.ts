import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { QuestionInstance, SuccessData } from './Question';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private entity = 'Question';
    constructor(private httpInstance: HttpClient) {}

    getQuestions(id: number, quantity: number): Observable<any> {
        return this.httpInstance.get(
            `${environment.BASEURL}${this.entity}/getRecordsRangeByTest/${id}/${quantity}/0/wi`
        );
    }
    getNumberOfQuestions(id: number): Observable<number> {
        return this.httpInstance
            .get(
                `${environment.BASEURL}${this.entity}/countRecordsByTest/${id}`
            )
            .pipe(pluck('numberOfRecords'));
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

    resultSuccess(successData: SuccessData, type: string): void {
        if (!successData.res) return null;
        successData.snackBar.open(successData.message, 'X', {
            duration: 3000,
        });
        const response = this.operationTypeResponse(type, successData);
        successData.dialogRef.close(response);
    }
    resultFailed(successData: SuccessData, type?: string): void {
        successData.snackBar.open(successData.message, 'X', {
            duration: 3000,
        });
        if (type === 'Delete') {
            successData.dialogRef.close({
                finished: false,
                question: successData.data,
            });
        }
    }
    operationTypeResponse(
        type: string,
        successData: SuccessData
    ): {
        finished: boolean;
        question?: QuestionInstance;
        updatedquestion?: QuestionInstance;
    } {
        let response;
        switch (type) {
            case 'Delete':
                response = {
                    finished: true,
                    question: successData.data,
                };
                break;
            case 'Update':
                response = {
                    finished: true,
                    updatedquestion: {
                        ...successData.res[0],
                    },
                };
                break;
        }
        return response;
    }
}
