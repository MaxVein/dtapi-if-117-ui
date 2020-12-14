import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AnswersService {
    constructor(private http: HttpClient) {}

    getQuestions(id: string) {
        const url = `Question/getRecords/${id}/`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    getAnswers(id: string | number) {
        const url = `answer/getAnswersByQuestion/${id}/`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    getRecordsQuestion(id: string) {
        const url = `question/getRecords/${id}/`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
    createQuestionRequest(payload) {
        const url = `question/insertData/`;
        return this.http.post(`${environment.BASEURL}${url}`, payload);
    }
    createAnswerRequest(payload) {
        const url = `answer/insertData/`;
        return this.http.post(`${environment.BASEURL}${url}`, payload);
    }
    updateAnswer(payload, id) {
        const url = `answer/update/${id}`;
        return this.http.post(`${environment.BASEURL}${url}`, payload);
    }
    updateQuestion(payload, id) {
        const url = `question/update/${id}`;
        return this.http.post(`${environment.BASEURL}${url}`, payload);
    }
    deleteAnswer(id) {
        const url = `answer/del/${id}`;
        return this.http.get(`${environment.BASEURL}${url}`);
    }
}
