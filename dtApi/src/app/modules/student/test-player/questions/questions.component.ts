import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface AnswerData {
    question_id: number;
    answer_ids: any[];
}
@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
    @Input() questionsAndAnswers: any;
    answersIdNum = [];
    answerIdsMulti: number[] = [];
    completed: number[] = [];
    btnCount: number[] = [];
    startTest = 0;
    sendAnswerData: AnswerData[] = [];
    textValue: string[] = [];
    @Output() studentAnswer = new EventEmitter<AnswerData[]>();
    constructor() {}
    ngOnInit(): void {
        this.btnCount = [...Array(this.questionsAndAnswers.length).keys()];
    }
    changeQuestion(event, index: number) {
        event.preventDefault();
        this.startTest = index;
    }

    trueAnswerMulti(event, id: number) {
        if (event.checked) {
            this.answerIdsMulti.push(id);
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsAndAnswers[this.startTest].question_id,
                this.answerIdsMulti
            );
        } else if (event.checked === false) {
            this.answerIdsMulti = this.answerIdsMulti.filter(
                (elem) => elem !== id
            );
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsAndAnswers[this.startTest].question_id,
                this.answerIdsMulti
            );
        }
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
    }
    createStudentAnswer(questionId: number, answerId: any[]): AnswerData {
        return { question_id: questionId, answer_ids: answerId };
    }
    trueAnswerSimpleOne(event, answerId: number): void {
        if (event.checked) {
            this.completed[this.startTest] = answerId;
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsAndAnswers[this.startTest].question_id,
                [answerId]
            );
            this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        }
    }
    removeEmptyElem(array: AnswerData[]): AnswerData[] {
        return array.filter((el) => el !== null);
    }
    trueAnswerText(event) {
        this.textValue[this.startTest] = event.target.value;
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            +this.questionsAndAnswers[this.startTest].question_id,
            [event.target.value]
        );
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
    }
    getTrueAnswer(answerId: number, index: number): boolean {
        if (this.sendAnswerData[this.startTest]) {
            return this.sendAnswerData[this.startTest].answer_ids.includes(
                answerId
            );
        }
    }
    truAnswerNum(event) {
        if (!this.answersIdNum[this.startTest]) {
            this.answersIdNum[this.startTest] = [];
        }
        if (event.target.id === `${this.startTest}-min`) {
            this.answersIdNum[this.startTest][0] = event.target.value;
        } else if (event.target.id === `${this.startTest}-max`) {
            this.answersIdNum[this.startTest][1] = event.target.value;
        }
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            +this.questionsAndAnswers[this.startTest].question_id,
            this.answersIdNum[this.startTest]
        );
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
    }
}
