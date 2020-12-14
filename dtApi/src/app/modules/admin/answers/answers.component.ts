import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { answerData, questionData, Response } from './answersInterfaces';
import { AnswersService } from './answers.service';
import { minMaxValidator } from './validators/minMaxValidator';

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
})
export class AnswersComponent implements OnInit {
    answerAtachmentSrc = '';
    noChanges = false;
    updateAnswers: answerData[];
    questionChanges = false;
    answerTypeChanges = false;
    typeNumericChanges = false;
    alertMessage = 'Увага';
    errorQuestionTitle = "Це поле обов'язкове";
    showAtachmentAnswer = false;
    answerAttachmentArr: string[];
    isAttachmentQuestion = false;
    noAnswers = false;
    idAnswerArray: string[] = [];
    createMode = true;
    formAnswerArray;
    attachmentQuestionSrc: string;
    state: questionData;
    testId: string;
    questionId: string;
    arrayOfButtons = [];
    sendAnswerData: answerData[] = [];
    sendQuestionData: questionData;
    checkedElem: string;
    answerForm: FormGroup;
    showAnswers = false;
    showAnswersNumeric = false;
    levelType = [...Array(20).keys()];
    questionType: string[] = [
        'Простий вибір',
        'Мульти вибір',
        'Текстове поле',
        'Числовий діапазон',
    ];
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private answerServise: AnswersService,
        public modalService: ModalService
    ) {}
    formInitialazer() {
        this.answerForm = this.fb.group({
            questionText: [
                this.state ? this.state.question_text : '',
                Validators.required,
            ],
            typeOfQuestion: [this.state ? this.state.type : '1'],
            level: [this.state ? this.state.level : '1'],
            atachmentQuestion: [this.state ? this.state.attachment : ''],
            answersType: this.fb.array([]),
            answersTypeNumeric: this.fb.group(
                {
                    numericAnswerMin: ['', Validators.required],
                    numericAnswerMax: ['', Validators.required],
                    answer_idMin: [''],
                    answer_idMax: [''],
                },
                {
                    validators: [minMaxValidator],
                }
            ),
        });
    }
    newAnswersType(item?, trueAnswer?): FormGroup {
        return this.fb.group({
            text: [item ? item.answer_text : '', Validators.required],
            trueAnswerSimple: [
                trueAnswer === '1' ? true : false,
                Validators.required,
            ],
            trueAnswerMulti: [
                trueAnswer === '1' ? true : false,
                Validators.required,
            ],
            atachmentAnswer: [item ? item.attachment : ''],
            answer_id: [item ? item.answer_id : ''],
        });
    }
    get level() {
        const levelValue = this.answerForm.get('level').value;
        return levelValue;
    }
    get typeOfQuestion() {
        const typeOfQuestionValue = this.answerForm.get('typeOfQuestion').value;
        return typeOfQuestionValue;
    }
    get questionText() {
        const questionTextValue = this.answerForm.get('questionText').value;
        return questionTextValue;
    }
    get answersType(): FormArray {
        return this.answerForm.get('answersType') as FormArray;
    }
    get answersTypeNumeric() {
        return this.answerForm.get('answersTypeNumeric');
    }
    get atachmentQuestion() {
        return this.answerForm.get('atachmentQuestion');
    }
    get trueAnswer() {
        return this.answerForm.controls.answersType;
    }
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.testId = params.test_id;
            this.questionId = params.questionId;
        });
        this.state = history.state.data;

        this.state = history.state.data;
        if (this.state) {
            const question = history.state.data;
            switch (question.type) {
                case 'Простий вибір':
                    question.type = 1;
                    break;
                case 'Мульти вибір':
                    question.type = 2;
                    break;
                case 'Текстове поле':
                    question.type = 3;
                    break;
                case 'Числове поле вводу':
                    question.type = 4;
                    break;
            }
            this.state = question;
            this.initializeEditMode();
        }
        this.formInitialazer();
    }

    //update question and answer part
    initializeEditMode() {
        this.createMode = false;
        this.questionId = this.state.question_id;
        this.attachmentQuestionSrc = this.state.attachment;
        (this.testId = this.state.test_id),
            this.answerServise
                .getQuestions(this.questionId)
                .subscribe((res: questionData) => {
                    if (res[0]) {
                        this.state.attachment = res[0].attachment;
                        this.attachmentQuestionSrc = res[0].attachment;
                    } else {
                        this.state.attachment = '';
                    }
                    this.getAnswers();
                });
    }
    getAnswers() {
        this.answerServise
            .getAnswers(this.state.question_id)
            .subscribe((res: answerData[]) => {
                this.answerForm.get('typeOfQuestion').disable();
                if (!res[0]) {
                    this.noAnswers = true;
                    this.noChanges = true;
                } else {
                    this.updateAnswers = res;
                    this.fillForm(res);
                }
            });
    }

    fillForm(result: answerData[]) {
        this.showAnswers = true;
        this.formAnswerArray = result;
        if (this.typeOfQuestion === '4') {
            this.showAnswersNumeric = true;
            this.formAnswerArray.map((item: answerData, index: number) => {
                this.idAnswerArray.push(item.answer_id);
                if (index === 0) {
                    this.answerForm.controls.answersTypeNumeric
                        .get('numericAnswerMin')
                        .setValue(item.answer_text);
                    this.answerForm.controls.answersTypeNumeric
                        .get('answer_idMin')
                        .setValue(item.answer_id);
                } else {
                    this.answerForm.controls.answersTypeNumeric
                        .get('numericAnswerMax')
                        .setValue(item.answer_text);
                    this.answerForm.controls.answersTypeNumeric
                        .get('answer_idMax')
                        .setValue(item.answer_id);
                }
            });
        } else {
            this.formAnswerArray.map((item: answerData) => {
                this.idAnswerArray.push(item.answer_id);
                this.showAtachmentAnswer = item.attachment ? true : false;
                const trueAnswer = item.true_answer;
                this.answersType.push(this.newAnswersType(item, trueAnswer));
            });
        }
    }
    compareQuestions(): boolean {
        if (this.createMode) {
            return false;
        }
        return this.objectsAreSame(this.sendQuestionData, this.state);
    }
    removeImageQuestion() {
        this.attachmentQuestionSrc = '';
        this.answerForm.controls.atachmentQuestion.setValue('');
        this.answerForm.controls.atachmentQuestion.markAsDirty();
    }
    compareAnswers(): boolean {
        if (this.noChanges) {
            return false;
        } else if (!this.createMode) {
            if (this.sendAnswerData.length !== this.updateAnswers.length) {
                return false;
            }
            return this.sendAnswerData
                .map((elem, index) => {
                    return this.objectsAreSame(elem, this.updateAnswers[index]);
                })
                .every((elem, index) => {
                    return elem === true;
                });
        }
    }
    finaleCompare() {
        let chooseArr = 0;
        if (this.sendAnswerData.length > this.updateAnswers.length) {
            chooseArr = this.updateAnswers.length;
        } else {
            chooseArr = this.sendAnswerData.length;
        }
        this.idAnswerArray.slice(0, chooseArr);
        const result = [];
        for (let i = 0; i < this.idAnswerArray.length; i++) {
            if (
                this.objectsAreSame(
                    this.sendAnswerData[i],
                    this.updateAnswers[i]
                ) === false
            ) {
                result.push(this.idAnswerArray[i]);
            }
        }
        this.idAnswerArray = result;
    }
    removeImageAnswer(i: number) {
        this.answersType.controls[i].get('atachmentAnswer').setValue('');
        this.showAtachmentAnswer = false;
    }
    objectsAreSame(x, y) {
        let objectsAreSame = true;
        for (const propertyName in x) {
            if (x[propertyName] !== y[propertyName]) {
                objectsAreSame = false;
                break;
            }
        }
        return objectsAreSame;
    }

    //create question part
    getQuestionAttachment(): Observable<any> {
        const file = this.atachmentQuestion.value;
        if (!file) {
            return of('');
        } else if (typeof file === 'string') {
            return of(file);
        } else {
            return this.getImageBase64(file._files[0]);
        }
    }
    createQuestionData() {
        this.sendQuestionData = {
            question_id: this.questionId,
            test_id: this.testId,
            question_text: this.questionText,
            level: this.level,
            type: this.typeOfQuestion,
            attachment: this.atachmentQuestion.value
                ? this.atachmentQuestion.value
                : '',
        };
    }
    createQuestion() {
        this.getQuestionAttachment()
            .pipe(
                concatMap((res) => {
                    this.sendQuestionData.attachment = res;
                    if (this.createMode) {
                        return this.answerServise.createQuestionRequest(
                            this.sendQuestionData
                        );
                    } else if (!this.compareQuestions()) {
                        return this.answerServise.updateQuestion(
                            this.sendQuestionData,
                            this.questionId
                        );
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((res: questionData) => {
                if (res === null) {
                } else if (this.questionId === res[0].question_id) {
                    this.openModal('Alert', 'Question Update', AlertComponent);
                } else if (res) {
                    this.openModal('Alert', 'Question Create', AlertComponent);
                    this.questionId = res[0].question_id;
                }
                this.sendAnswerDataRequest();
                this.navigateToQuestionPage(res);
            });
    }

    // create answer part

    addAnswer(e) {
        e.preventDefault();
        this.noChanges = true;
        this.noAnswers = false;
        this.showAnswers = true;
        this.answersType.push(this.newAnswersType());
    }
    removeAnswer(index: number) {
        const removeId = this.idAnswerArray[index];

        this.modalService.openModal(ConfirmComponent, {
            data: {
                icon: 'question_answer',
                message: 'Ви впевнені що бажаєте видалити цю відповідь?',
            },
        });

        if (!this.createMode && removeId) {
            const removeId = this.idAnswerArray[index];
            this.answerServise
                .deleteAnswer(+removeId)
                .subscribe((res: Response) => {
                    if (res.response === 'ok') {
                        this.idAnswerArray.splice(index, 1);
                    }
                });
        }
        this.answersType.removeAt(index);
    }
    getTrueAnswer(item) {
        switch (this.typeOfQuestion) {
            case '1':
                if (item.trueAnswerSimple) {
                    return '1';
                } else {
                    return '0';
                }
            case '2':
                if (item.trueAnswerMulti) {
                    return '1';
                } else {
                    return '0';
                }
            default:
                return '1';
        }
    }
    inputAnswerAtachment(index: number) {
        const atachment = this.answersType.controls[index].get(
            'atachmentAnswer'
        );
        if (this.answersType.value[index].atachmentAnswer._files[0]) {
            this.getImageBase64(
                this.answersType.value[index].atachmentAnswer._files[0]
            ).subscribe((res) => {
                atachment.setValue(res);
                this.answerAtachmentSrc = res;
            });
        } else {
            atachment.setValue('');
        }
    }
    getImageBase64(file) {
        const reader = new FileReader();
        return new Observable((observer: Observer<any>) => {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                observer.next(reader.result);
                observer.complete();
            };
        });
    }
    isTrueAnswer(): boolean {
        switch (this.typeOfQuestion) {
            case '1':
                return this.trueAnswer.value.every(
                    (res) => res.trueAnswerSimple === false
                );
            case '2':
                return this.trueAnswer.value.every(
                    (res) => res.trueAnswerMulti === false
                );
            default:
                return false;
        }
    }
    createAnswer() {
        this.sendAnswerData = [];
        const formFieldsValue = this.answerForm.value;
        formFieldsValue.answersType.map((item) => {
            {
                this.sendAnswerData.push({
                    answer_id: item.answer_id,
                    question_id: this.questionId,
                    true_answer: this.getTrueAnswer(item),
                    answer_text: item.text,
                    attachment: item.atachmentAnswer,
                });
            }
        });
        if (this.typeOfQuestion === '4') {
            const typeQuestionNumeric = [
                {
                    answer_text:
                        formFieldsValue.answersTypeNumeric.numericAnswerMin,

                    answer_id: formFieldsValue.answersTypeNumeric.answer_idMin,
                },
                {
                    answer_text:
                        formFieldsValue.answersTypeNumeric.numericAnswerMax,
                    answer_id: formFieldsValue.answersTypeNumeric.answer_idMax,
                },
            ];
            for (let i = 0; i < typeQuestionNumeric.length; i++) {
                const item = typeQuestionNumeric[i];
                this.sendAnswerData.push({
                    answer_id: item.answer_id,
                    answer_text: item.answer_text,
                    true_answer: '1',
                    question_id: this.questionId,
                    attachment: '',
                });
            }
        }
    }

    changeType() {
        switch (this.typeOfQuestion) {
            case '4':
                this.showAnswersNumeric = true;
                this.showAnswers = false;
                break;
            default:
                this.showAnswersNumeric = false;
                this.showAnswers = true;
                break;
        }
    }
    checkRadioBtn(id) {
        this.answersType.value.map((elem, index) => {
            if (id !== index) {
                this.answersType.controls[index]
                    .get('trueAnswerSimple')
                    .setValue(false);
            }
        });
    }

    sendAnswerDataRequest() {
        if (this.createMode) {
            this.createAnswer();
        }
        if (!this.createMode && this.updateAnswers) {
            this.finaleCompare();
        }
        this.sendAnswerData.map((elem, index) => {
            if (this.createMode || !elem.answer_id) {
                delete elem.answer_id;
                return this.answerServise
                    .createAnswerRequest(elem)
                    .subscribe((res) => {});
            } else if (this.idAnswerArray.includes(elem.answer_id)) {
                return this.answerServise
                    .updateAnswer(elem, elem.answer_id)
                    .subscribe((res) => {
                        if (this.compareQuestions() && res) {
                            this.openModal(
                                'Alert',
                                'Answers Updated',
                                AlertComponent
                            );
                        }
                    });
            }
        });
    }
    createQuestionAndAnswer() {
        if (!this.compareAnswers() && !this.createMode) {
            this.createAnswer();
        }
        this.createQuestionData();
        if (
            (this.answersType.controls.length === 0 &&
                this.answersTypeNumeric.invalid) ||
            (this.compareAnswers() && this.compareQuestions())
        ) {
            let message = 'Питання повинне містити відповіді';
            if (
                this.answersTypeNumeric.errors?.comparisonError &&
                this.typeOfQuestion === '4'
            ) {
                message =
                    'Мінімальне значення не може бути більше або рівне макcимального';
            } else if (this.compareAnswers() && this.compareQuestions()) {
                message = 'Для редагування внесіть зміни в форму';
            }
            this.openModal(this.alertMessage, message, AlertComponent);
            return;
        } else if (this.answerForm.controls.answersType.invalid) {
            return;
        } else if (this.isTrueAnswer()) {
            this.openModal(
                'Помилка',
                'Відсутня правильна відповідь',
                AlertComponent
            );
            return;
        } else {
            this.createQuestion();
        }
    }
    cancelRedirect(e) {
        e.preventDefault();
        this.router.navigate([`admin/subjects/tests/${this.testId}/questions`]);
    }
    navigateToQuestionPage(data: questionData) {
        this.router.navigate(
            [`admin/subjects/tests/${this.testId}/questions`],
            {
                state: { data: data },
            }
        );
    }
    openModal(title: string, message: string, component: any) {
        this.modalService.openModal(component, {
            data: {
                message,
                title,
            },
        });
    }
    openModalConfrim() {
        this.modalService.openModal(ConfirmComponent, {
            data: {
                icon: 'question_answer',
                message: 'Ви впевнені що бажаєте видалити цю відповідь?',
            },
        });
    }
}
