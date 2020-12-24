import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
    AnswerData,
    QA,
} from '../../../../shared/interfaces/test-player.interfaces';
import { Answer } from '../../../../shared/interfaces/student.interfaces';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
    @Input() questionsAndAnswers: QA[];
    @Output() onAnswer: EventEmitter<AnswerData[]> = new EventEmitter<
        AnswerData[]
    >();
    isAnswer: number[] = [];
    answersIdNum = [];
    answerIdsMulti: number[] = [];
    completed: number[] = [];
    btnCount: number[] = [];
    startTest = 0;
    sendAnswerData: AnswerData[] = [];
    textValue: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.onAnswer.emit(this.firstEmitData());
        this.getRandomAnswers(this.questionsAndAnswers);
        this.btnCount = [...Array(this.questionsAndAnswers.length).keys()];
    }
    firstEmitData() {
        let firstEmit = [];
        firstEmit = this.questionsAndAnswers.map((elem) => {
            return { question_id: +elem.question_id, answer_ids: [''] };
        });
        return firstEmit;
    }
    changeQuestion(event: Event, index: number) {
        event.preventDefault();
        this.startTest = index;
    }

    trueAnswerMulti(event: MatCheckboxChange, id: number): void {
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
        this.onAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }

    trueAnswerSimpleOne(event: MatCheckboxChange, answerId: number): void {
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
        this.onAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }

    trueAnswerText(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.textValue[this.startTest] = value ? value : null;
        this.sendUserAnswer(value);
    }

    truAnswerNum(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.answersIdNum[this.startTest] = value ? value : null;
        this.sendUserAnswer(value);
    }

    sendUserAnswer(value: any): void {
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            +this.questionsAndAnswers[this.startTest].question_id,
            [value]
        );
        this.onAnswer.emit(this.removeEmptyElem(this.sendAnswerData));
        this.markStudentAnswer();
    }

    createStudentAnswer(
        questionId: number,
        answerId: Array<number>
    ): AnswerData {
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
