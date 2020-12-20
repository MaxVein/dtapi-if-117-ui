import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';

import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import {
    AnswerData,
    QuestionData,
    Response,
    AnswerType,
} from './answersInterfaces';
import { AnswersService } from './answers.service';
import { minMaxValidator } from './validators/minMaxValidator';

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AnswersComponent implements OnInit {
    allSubscription: Subscription;
    confirmIcon = 'question_answer';
    answerAtachmentSrc: string[] = [];
    noChanges = false;
    updateAnswers: AnswerData[];
    alert = {
        titleAlert: 'Повідомлення',
        titleError: 'Помилка',
        messageNoAnswer: 'Питання повинне містити відповіді',
        messageNumCompare:
            'Мінімальне значення не може бути більше або рівне макcимального',
        messageNoEdit: 'Для редагування внесіть зміни в форму',
        messageNoTruAnswer: 'Відсутня правильна відповідь',
        messageAnswerUpdate: 'Відповідь оновлена',
        messageAnswerCreate: 'Відповідь створена',
        messageAnswerDelete: 'Відповідь видалена',
        messageQuestionCreate: 'Питання створено',
        messageQuestionUpdate: 'Питання оновлено',
        messageConfirm: 'Ви впевнені що бажаєте видалити цю відповідь?',
        messageNoAnswerTitle: "Заповніть усі обов'язкові поля",
    };
    errorQuestionTitle = "Це поле обов'язкове";
    showAtachmentAnswer = false;
    answerAttachmentArr: string[];
    noAnswers = false;
    idAnswerArray: string[] = [];
    createMode = true;
    attachmentQuestionSrc: string;
    state: QuestionData;
    testId: string;
    questionId: string;
    sendAnswerData: AnswerData[] = [];
    sendQuestionData: QuestionData;
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
    newAnswersType(item?: AnswerData, trueAnswer?: string): FormGroup {
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
        let mode: string;
        this.activatedRoute.queryParams.subscribe((params) => {
            this.testId = params.test_id;
            mode = params.mode;
        });
        if (mode === 'edit') {
            this.state = history.state.data;
            this.checkState(mode);
        }
        this.formInitialazer();
    }
    checkState(mode: string): void {
        if (this.state) {
            const localState = this.state;
            localStorage.setItem(
                'state',
                JSON.stringify({
                    localState,
                })
            );
        }
        if (mode === 'edit' && !this.state) {
            const data = JSON.parse(localStorage.getItem('state'));
            this.state = data.localState;
        }
        this.state.test_id = this.testId;
        switch (this.state.type) {
            case 'Простий вибір':
                this.state.type = '1';
                break;
            case 'Мульти вибір':
                this.state.type = '2';
                break;
            case '	Текстове поле':
                this.state.type = '3';
                break;
            case 'Числове поле вводу':
                this.state.type = '4';
                break;
            default:
                break;
        }
        this.initializeEditMode();
    }
    //update question and answer part
    initializeEditMode(): void {
        this.createMode = false;
        this.questionId = this.state.question_id;
        this.attachmentQuestionSrc = this.state.attachment;
        this.allSubscription = this.answerServise
            .getQuestions(this.questionId)
            .subscribe((res: QuestionData) => {
                if (res[0]) {
                    this.state.attachment = res[0].attachment;
                    this.attachmentQuestionSrc = res[0].attachment;
                } else {
                    this.state.attachment = '';
                }
                this.getAnswers();
            });
    }
    getAnswers(): void {
        this.answerServise
            .getAnswers(this.state.question_id)
            .subscribe((res: AnswerData[]) => {
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

    fillForm(result: AnswerData[]): void {
        this.showAnswers = true;
        if (this.typeOfQuestion === '4') {
            this.showAnswersNumeric = true;
            result.map((item: AnswerData, index: number) => {
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
            result.map((item: AnswerData) => {
                this.answerAtachmentSrc.push(item.attachment);
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
    removeImageQuestion(): void {
        this.attachmentQuestionSrc = '';
        this.answerForm.controls.atachmentQuestion.setValue('');
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
                .every((elem) => {
                    return elem === true;
                });
        }
    }
    getIdOfUpdateAnswer(): void {
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
    removeImageAnswer(i: number): void {
        this.answersType.controls[i].get('atachmentAnswer').setValue('');
        this.answerAtachmentSrc[i] = '';
    }
    objectsAreSame(x, y): boolean {
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
    createQuestionData(): void {
        this.sendQuestionData = {
            question_id: this.questionId,
            question_text: this.questionText,
            type: this.typeOfQuestion,
            level: this.level,
            test_id: this.testId,
            attachment: this.atachmentQuestion.value
                ? this.atachmentQuestion.value
                : '',
        };
    }
    inputQuestionAtachment(): void {
        const atachment = this.answerForm.get('atachmentQuestion');
        if (atachment.value._files[0]) {
            this.getImageBase64(atachment.value._files[0]).subscribe((res) => {
                atachment.setValue(res);
                this.attachmentQuestionSrc = res;
            });
        } else {
            atachment.setValue('');
        }
    }
    createQuestion(): void {
        if (this.createMode) {
            this.answerServise
                .createQuestionRequest(this.sendQuestionData)
                .subscribe((res: QuestionData) => {
                    this.openModal(
                        this.alert.titleAlert,
                        this.alert.messageQuestionCreate,
                        AlertComponent
                    );
                    this.questionId = res[0].question_id;
                    this.sendAnswerDataRequest();
                    this.navigateToQuestionPage();
                });
        } else if (!this.compareQuestions()) {
            this.answerServise
                .updateQuestion(this.sendQuestionData, this.questionId)
                .subscribe((res: QuestionData) => {
                    if (this.questionId === res[0].question_id) {
                        this.openModal(
                            this.alert.titleAlert,
                            this.alert.messageQuestionUpdate,
                            AlertComponent
                        );
                    }
                    this.sendAnswerDataRequest();
                    this.navigateToQuestionPage();
                });
        } else {
            this.sendAnswerDataRequest();
            this.navigateToQuestionPage();
        }
    }

    // create answer part

    addAnswer(e: MouseEvent): void {
        e.preventDefault();
        this.noChanges = true;
        this.noAnswers = false;
        this.showAnswers = true;
        this.answersType.push(this.newAnswersType());
    }

    removeAnswer(e: MouseEvent, index: number): void {
        e.preventDefault();
        const removeId = this.idAnswerArray[index];
        if (!this.createMode && removeId) {
            this.modalService.openModal(
                ConfirmComponent,
                {
                    data: {
                        icon: this.confirmIcon,
                        message: this.alert.messageConfirm,
                    },
                },
                (result) => {
                    dialog(result);
                }
            );
            const dialog = (res: boolean) => {
                if (res) {
                    this.allSubscription = this.answerServise
                        .deleteAnswer(+removeId)
                        .subscribe((res: Response) => {
                            if (res.response === 'ok') {
                                this.answersType.removeAt(index);
                                this.idAnswerArray.splice(index, 1);
                                this.openModal(
                                    this.alert.titleAlert,
                                    this.alert.messageAnswerDelete,
                                    AlertComponent
                                );
                            }
                        });
                } else {
                    return;
                }
            };
        } else {
            this.answersType.removeAt(index);
        }
    }
    getTrueAnswer(item: AnswerType): string {
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
    inputAnswerAtachment(index: number): void {
        const atachment = this.answersType.controls[index].get(
            'atachmentAnswer'
        );
        if (this.answersType.value[index].atachmentAnswer._files[0]) {
            this.allSubscription = this.getImageBase64(
                this.answersType.value[index].atachmentAnswer._files[0]
            ).subscribe((res: string) => {
                this.answerAtachmentSrc[index] = res;
                atachment.setValue(res);
            });
        } else {
            atachment.setValue('');
        }
    }
    getImageBase64(file): Observable<any> {
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
                    (res: AnswerType) => res.trueAnswerSimple === false
                );
            case '2':
                return this.trueAnswer.value.every(
                    (res: AnswerType) => res.trueAnswerMulti === false
                );
            default:
                return false;
        }
    }
    createAnswerData(): void {
        this.sendAnswerData = [];
        const formFieldsValue = this.answerForm.value;
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
                    answer_text: `${item.answer_text}`,
                    true_answer: '1',
                    question_id: this.questionId,
                    attachment: '',
                });
            }
        } else {
            formFieldsValue.answersType.map((item: AnswerType) => {
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
        }
    }
    changeTypeQuestion(): void {
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
    trueAnswerSimpleOne(id: number): void {
        this.answersType.value.map((elem: AnswerType, index: number) => {
            if (id !== index) {
                this.answersType.controls[index]
                    .get('trueAnswerSimple')
                    .setValue(false);
            }
        });
    }

    sendAnswerDataRequest(): void {
        let counter: number = null;
        if (this.createMode) {
            this.createAnswerData();
        }
        if (!this.createMode && this.updateAnswers) {
            this.getIdOfUpdateAnswer();
        }
        this.sendAnswerData.map((elem) => {
            if (this.createMode || !elem.answer_id) {
                delete elem.answer_id;
                return (this.allSubscription = this.answerServise
                    .createAnswerRequest(elem)
                    .subscribe((res: AnswerData) => {
                        if (res[0].answer_id && this.compareQuestions()) {
                            counter = 0;
                        }
                    }));
            } else if (this.idAnswerArray.includes(elem.answer_id)) {
                return (this.allSubscription = this.answerServise
                    .updateAnswer(elem, elem.answer_id)
                    .subscribe((res) => {
                        if (this.compareQuestions() && res) {
                            counter = 1;
                        }
                    }));
            }
        });
        this.showMessage(counter);
    }
    showMessage(counter: number) {
        if (this.compareQuestions()) {
            const message =
                counter === 0
                    ? this.alert.messageAnswerCreate
                    : this.alert.messageAnswerUpdate;
            this.openModal(this.alert.titleAlert, message, AlertComponent);
        }
    }
    createQuestionAndAnswer(): void {
        this.createAnswerData();
        this.createQuestionData();
        if (
            (this.compareAnswers() && this.compareQuestions()) ||
            (this.answersTypeNumeric.errors?.comparisonError &&
                this.typeOfQuestion === '4')
        ) {
            let message = this.alert.messageNoAnswer;
            if (
                this.answersTypeNumeric.errors?.comparisonError &&
                this.typeOfQuestion === '4'
            ) {
                message = this.alert.messageNumCompare;
            } else if (this.compareAnswers() && this.compareQuestions()) {
                message = this.alert.messageNoEdit;
            }
            this.openModal(this.alert.titleAlert, message, AlertComponent);
            return;
        } else if (
            this.isTrueAnswer() ||
            this.sendAnswerData.some((elem) => elem.answer_text === '')
        ) {
            this.openModal(
                this.alert.titleError,
                this.isTrueAnswer()
                    ? this.alert.messageNoTruAnswer
                    : this.alert.messageNoAnswerTitle,
                AlertComponent
            );
            return;
        } else {
            this.createQuestion();
        }
    }
    cancelButton(e: MouseEvent): void {
        e.preventDefault();
        this.navigateToQuestionPage();
    }
    navigateToQuestionPage(): void {
        this.router.navigate(
            [`admin/subjects/tests/${this.testId}/questions`],
            {
                queryParams: {
                    test_id: this.testId,
                },
            }
        );
    }
    openModal(title: string, message: string, component: any): void {
        this.modalService.openModal(component, {
            data: {
                message,
                title,
            },
        });
    }
}
