import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { AnswersService } from '../../../admin/answers/answers.service';
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
    answerForm: FormGroup;
    answerIdsMulti: number[] = [];
    singleChecked = false;
    questions = [
        {
            attachment: '',
            level: '6',
            question_id: '223',
            question_text: 'Q2_Simple_CHOICE [  Water element]',
            test_id: '1',
            type: '1',
        },
        {
            attachment: '',
            level: '6',
            question_id: '955',
            question_text: 'Q2_MULTI_CHOICE [  Water element]',
            test_id: '1',
            type: '2',
        },
        {
            attachment: '',
            level: '6',
            question_id: '956',
            question_text: 'Q2_Text_CHOICE [  Water element]',
            test_id: '1',
            type: '3',
        },
        {
            attachment: '',
            level: '6',
            question_id: '956',
            question_text: 'Q2_Number_CHOICE [  Water element]',
            test_id: '1',
            type: '4',
        },
        {
            attachment: '',
            level: '6',
            question_id: '234',
            question_text: 'Q2_Number_CHOICE [  Water element]',
            test_id: '1',
            type: '1',
        },
    ];
    questionsId = {
        entity: 'Question',
        ids: ['223', '955', '230', '234', '246', '245', '260', '238'],
    };
    answers = [
        [
            {
                answer_id: '497',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими елементами і групами даних",
                attachment: '',
                question_id: '223',
                true_answer: '1',
            },
            {
                answer_id: '498',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими групами даних",
                attachment: '',
                question_id: '223',
                true_answer: '0',
            },
            {
                answer_id: '499',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими елементами даних",
                attachment: '',
                question_id: '223',
                true_answer: '0',
            },
            {
                answer_id: '500',
                answer_text: 'деяка ієрархія даних',
                attachment: '',
                question_id: '223',
                true_answer: '0',
            },
        ],
        [
            {
                answer_id: '1',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими елементами і групами даних",
                attachment: '',
                question_id: '955',
                true_answer: '1',
            },
            {
                answer_id: '2',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими групами даних",
                attachment: '',
                question_id: '955',
                true_answer: '0',
            },
        ],
        [],
        [],
        [
            {
                answer_id: '10',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими елементами і групами даних",
                attachment: '',
                question_id: '234',
                true_answer: '1',
            },
            {
                answer_id: '11',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими групами даних",
                attachment: '',
                question_id: '234',
                true_answer: '1',
            },
            {
                answer_id: '12',
                answer_text:
                    "набір правил і обмежень, що визначають зв'язки між окремими елементами даних",
                attachment: '',
                question_id: '234',
                true_answer: '1',
            },
            {
                answer_id: '13',
                answer_text: 'деяка ієрархія даних',
                attachment: '',
                question_id: '234',
                true_answer: '1',
            },
        ],
    ];
    completed: number[] = [];
    btnCount = [...Array(this.questions.length).keys()];
    startTest = 0;
    sendAnswerData: AnswerData[] = [];
    textValue: string[] = [];
    constructor(private fb: FormBuilder) {}
    get Answers(): FormArray {
        return this.answerForm.get('answers') as FormArray;
    }
    ngOnInit(): void {}
    changeQuestion(event, index: number) {
        event.preventDefault();
        this.startTest = index;
    }

    trueAnswerMulti(e, id: number) {
        if (e.checked) {
            this.answerIdsMulti.push(id);
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsId.ids[this.startTest],
                this.answerIdsMulti
            );
        } else if (e.checked === false) {
            this.answerIdsMulti = this.answerIdsMulti.filter(
                (elem) => elem !== id
            );
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsId.ids[this.startTest],
                this.answerIdsMulti
            );
        }
    }
    createStudentAnswer(questionId: number, answerId: number[]): AnswerData {
        return { question_id: questionId, answer_ids: answerId };
    }
    trueAnswerSimpleOne(event, answerId: number): void {
        if (event.checked) {
            this.completed[this.startTest] = answerId;
            this.sendAnswerData[this.startTest] = this.createStudentAnswer(
                +this.questionsId.ids[this.startTest],
                [answerId]
            );
        }
    }
    trueAnswerText(event) {
        this.textValue[this.startTest] = event.target.value;
        this.sendAnswerData[this.startTest] = this.createStudentAnswer(
            1,
            event.target.value
        );
    }
    getTrueAnswer(answerId: number, index: number): boolean {
        if (this.sendAnswerData[this.startTest]) {
            return this.sendAnswerData[this.startTest].answer_ids.includes(
                answerId
            );
        }
    }
}
