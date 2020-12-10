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
    questionChanges: boolean;
    answerTypeChanges: boolean;
    typeNumericChanges: boolean;
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
    sendquestionData: questionData;
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
                },
                {
                    validators: [minMaxValidator],
                }
            ),
        });
    }
    get questionAtachment() {
        const atachmentQuestionValue = this.answerForm.get('atachmentQuestion')
            .value;
        return atachmentQuestionValue;
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
            this.testId = params.testId;
            this.questionId = params.questionId;
        });
        this.state = history.state.data;
        if (this.state) {
            this.initializeEditMode();
        }
        this.formInitialazer();
    }

    //update question and answer part
    initializeEditMode() {
        this.createMode = false;
        this.questionId = this.state.question_id;
        this.attachmentQuestionSrc = this.state.attachment;
        this.testId = this.state.test_id;
        this.answerServise
            .getAnswers(this.state.question_id)
            .subscribe((res: answerData[]) => {
                this.answerForm.get('typeOfQuestion').disable();
                if (!res[0]) {
                    this.noAnswers = true;
                } else {
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
                } else {
                    this.answerForm.controls.answersTypeNumeric
                        .get('numericAnswerMax')
                        .setValue(item.answer_text);
                }
            });
        } else {
            this.formAnswerArray.map((item: answerData) => {
                this.showAtachmentAnswer = item.attachment ? true : false;
                this.idAnswerArray.push(item.answer_id);
                const trueAnswer = item.true_answer;
                this.answersType.push(this.newAnswersType(item, trueAnswer));
            });
        }
    }

    updateAnswerRequest(elem, index) {
        return this.answerServise.updateAnswer(elem, this.idAnswerArray[index]);
    }
    removeImageQuestion() {
        this.attachmentQuestionSrc = '';
        this.answerForm.controls.atachmentQuestion.setValue('');
    }
    removeImageAnswer(i: number) {
        this.answersType.controls[i].get('atachmentAnswer').setValue('');
        this.showAtachmentAnswer = false;
    }
    onSubmitEditedProfile(form) {
        return Object.keys(form.controls).map((key) => {
            return {
                [key]: form.get(key).value,
                changed: form.get(key).dirty,
            };
        });
    }
    checkChangesForm() {
        this.questionChanges = this.onSubmitEditedProfile(this.answerForm)
            .splice(0, 4)
            .every((item) => {
                return item.changed === false;
            });
        const updateId = [];
        if (this.typeOfQuestion === '4') {
            this.onSubmitEditedProfile(this.answersTypeNumeric).map(
                (item, index) => {
                    if (item.changed) {
                        //   console.log(item.changed);

                        updateId.push(this.idAnswerArray[index]);
                    }
                }
            );
        } else {
            this.onSubmitEditedProfile(this.answersType).map((item, index) => {
                if (item.changed) {
                    updateId.push(this.idAnswerArray[index]);
                }
            });
        }
        this.idAnswerArray = updateId;
    }

    //create answer and question part
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
        });
    }

    addAnswer(e) {
        e.preventDefault();
        this.noAnswers = false;
        this.showAnswers = true;
        this.answersType.push(this.newAnswersType());
    }
    removeAnswer(index: number) {
        const removeId = this.idAnswerArray[index];
        // let result: any;
        // result = this.modalService.openModal(
        //     ConfirmComponent,
        //     {
        //         data: {
        //             icon: 'question_answer',
        //             message: 'Ви впевнені що бажаєте видалити цю відповідь?',
        //         },
        //     },
        //     result
        // );
        // console.log(result());

        if (!this.createMode && removeId) {
            const removeId = this.idAnswerArray[index];
            this.answerServise
                .deleteAnswer(+removeId)
                .subscribe((res: Response) => {
                    if (res.response === 'ok') {
                        this.idAnswerArray.splice(index, 1);
                    }
                    // console.log(res);
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

    createAnswer() {
        const formFieldsValue = this.answerForm.value;
        formFieldsValue.answersType.map((item, index) => {
            {
                this.sendAnswerData.push({
                    answer_text: item.text,
                    true_answer: this.getTrueAnswer(item),
                    question_id: this.questionId,
                    attachment: item.atachmentAnswer,
                });
            }
        });
        if (this.typeOfQuestion === '4') {
            const typeQuestionNumeric = [
                formFieldsValue.answersTypeNumeric.numericAnswerMin,
                formFieldsValue.answersTypeNumeric.numericAnswerMax,
            ];
            for (let i = 0; i < typeQuestionNumeric.length; i++) {
                const element = typeQuestionNumeric[i];
                this.sendAnswerData.push({
                    answer_text: element,
                    true_answer: '1',
                    question_id: this.questionId,
                    attachment: '',
                });
            }
        }
    }
    createQuestion() {
        const payload: questionData = {
            test_id: this.testId,
            question_text: this.questionText,
            level: this.level,
            type: this.typeOfQuestion,
        };
        this.getQuestionAttachment()
            .pipe(
                concatMap((res) => {
                    payload.attachment = res;
                    if (this.createMode) {
                        this.getAnswerAtachment();
                        return this.answerServise.createQuestionRequest(
                            payload
                        );
                    } else if (!this.questionChanges) {
                        this.getAnswerAtachment();
                        return this.answerServise.updateQuestion(
                            payload,
                            this.questionId
                        );
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((res: questionData) => {
                if (res) {
                    this.questionId = res[0].question_id;
                }
                this.sendAnswerDataRequest();
                this.navigateToQuestionPage(res);
            });
    }
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
    getAnswerAtachment() {
        this.answersType.controls.map((item) => {
            const file = item.value.atachmentAnswer;
            if (!file) {
                item.get('atachmentAnswer').setValue('');
            } else {
                this.getImageBase64(
                    item.value.atachmentAnswer._files[0]
                ).subscribe((res) => {
                    item.get('atachmentAnswer').setValue(res);
                });
            }
        });
    }

    createAnswerRequest(elem, index) {
        if (this.createMode) {
            this.answerServise.createAnswerRequest(elem).subscribe((res) => {
                //console.log(res);
            });
        } else {
            this.updateAnswerRequest(elem, index).subscribe((res) => {
                // console.log(res);
            });
        }
    }
    sendAnswerDataRequest() {
        this.createAnswer();
        this.sendAnswerData.map((elem, index) => {
            if (this.createMode || !this.idAnswerArray[index]) {
                this.answerServise
                    .createAnswerRequest(elem)
                    .subscribe((res) => {
                        //console.log(res);
                    });
            } else if (!this.createMode && this.idAnswerArray[index]) {
                this.answerServise
                    .updateAnswer(elem, this.idAnswerArray[index])
                    .subscribe((res) => {
                        // console.log(res);
                    });
            }
        });
        // let formValue = this.answerForm.value;
        // if (this.typeOfQuestion === '4') {
        //     this.sendAnswerData.map((elem, index) => {
        //         this.createAnswerRequest(elem, index);
        //     });
        // } else {
        //     this.sendAnswerData.map((elem, index) => {
        //         const file = formValue.answersType[index].atachmentAnswer;
        //         console.log(file);

        //         if (file) {
        //             this.getImageBase64(file._files[0])
        //                 .pipe(
        //                     concatMap((res) => {
        //                         elem.attachment = res;
        //                         if (
        //                             this.createMode ||
        //                             !this.idAnswerArray[index]
        //                         ) {
        //                             return this.answerServise.createAnswerRequest(
        //                                 elem
        //                             );
        //                         } else {
        //                             return this.answerServise.updateAnswer(
        //                                 elem,
        //                                 this.idAnswerArray[index]
        //                             );
        //                         }
        //                     })
        //                 )
        //                 .subscribe((res) => {
        //                     console.log(res);
        //                 });
        //         } else {
        //             elem.attachment = '';
        //             if (this.createMode || !this.idAnswerArray[index]) {
        //                 this.answerServise
        //                     .createAnswerRequest(elem)
        //                     .subscribe((res) => console.log(res));
        //             } else {
        //                 this.updateAnswerRequest(elem, index).subscribe((res) =>
        //                     console.log(res)
        //                 );
        //             }
        //         }
        //     });
        // }
    }
    createQuestionAndAnswer() {
        this.checkChangesForm();
        // this.questionFormChange.push(
        //     this.onSubmitEditedProfile(this.answerForm)
        // );
        // this.onSubmitEditedProfile(this.answerForm);
        // console.log(this.questionFormChange.splice(0, 4));
        // this.onSubmitEditedProfile(this.answersType);
        // console.log(this.answerTypeFormChange);
        // this.onSubmitEditedProfile(this.answersTypeNumeric);
        // console.log(this.answerTypeNumericFormChange);
        if (
            this.answersType.controls.length === 0 &&
            this.answersTypeNumeric.invalid
        ) {
            let message = 'Питання повинне містити відповіді';
            if (
                this.answersTypeNumeric.errors?.comparisonError &&
                this.typeOfQuestion === '4'
            ) {
                message =
                    'Мінімальне значення не може бути більше або рівне макcимального';
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
        this.router.navigate(['admin/subjects/test/questions']);
    }
    navigateToQuestionPage(data: questionData) {
        // console.log(data);
        this.router.navigate(['admin/subjects/test/questions'], {
            state: { data: data },
        });
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
}
