import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
    AnswerData,
    QA,
} from '../../../../shared/interfaces/test-player.interfaces';
import { Answer } from '../../../../shared/interfaces/student.interfaces';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
    @Input() questionsAndAnswers: QA[];
    isAnswer: number[] = [];
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
        this.studentAnswer.emit(this.firstEmitData());
        this.getRandomAnswers(this.questionsAndAnswers);
        this.btnCount = [...Array(this.questionsAndAnswers.length).keys()];
    }
    firstEmitData() {
        return this.questionsAndAnswers.map((elem) => {
            return { question_id: +elem.question_id, answer_ids: [''] };
        });
    }
    changeQuestion(event: MouseEvent, index: number) {
        event.preventDefault();
        this.startTest = index;
    }

    trueAnswerMulti(event, id: number): void {
        if (event.checked) {
            this.answerIdsMulti.push(id);
        } else if (!event.checked) {
            this.answerIdsMulti = this.answerIdsMulti.filter(
                (elem) => elem !== id
            );
        }
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            +this.questionsAndAnswers[this.startTest].question_id,
            this.answerIdsMulti
        );
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }

    trueAnswerSimpleOne(event, answerId: number): void {
        if (event.checked) {
            this.completed[this.startTest] = answerId;
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsAndAnswers[this.startTest].question_id,
                [answerId]
            );
        } else if (!event.checked) {
            this.completed[this.startTest] = null;
            this.sendAnswerData[this.startTest] = null;
        }
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }
    trueAnswerText(event): void {
        const value = event.target.value;
        this.textValue[this.startTest] = value ? value : null;
        this.sendUserAnswer(value);
    }
    truAnswerNum(event): void {
        const value = event.target.value;
        this.answersIdNum[this.startTest] = value ? value : null;
        this.sendUserAnswer(value);
    }
    sendUserAnswer(value): void {
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            +this.questionsAndAnswers[this.startTest].question_id,
            [value]
        );
        this.studentAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }
    createStudentAnswer(questionId: number, answerId: any[]): AnswerData {
        return { question_id: questionId, answer_ids: answerId };
    }

    removeEmptyElem(array: AnswerData[]): AnswerData[] {
        return array.filter((el) => el !== null);
    }

    getTrueAnswer(answerId: number, index: number): boolean {
        if (this.sendAnswerData[index]) {
            return this.sendAnswerData[index].answer_ids.includes(answerId);
        }
    }
    markStudentAnswer(): void {
        this.isAnswer = this.sendAnswerData.map((elem, index) => {
            return !elem ||
                elem.answer_ids.includes(null) ||
                !elem.answer_ids.length
                ? -1
                : index;
        });
    }
    getShuffledArr(arr: Answer[]): Answer[] {
        return arr.reduce(
            (newArr, _, i) => {
                const rand =
                    i + Math.floor(Math.random() * (newArr.length - i));
                [newArr[rand], newArr[i]] = [newArr[i], newArr[rand]];
                return newArr;
            },
            [...arr]
        );
    }
    getRandomAnswers(arr: QA[]): void {
        arr.forEach((elem) => {
            elem.answers = this.getShuffledArr(elem.answers);
        });
    }
}
