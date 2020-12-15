import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnswersService } from '../../answers/answers.service';
import { AnswerData } from '../../answers/answersInterfaces';
import { QuestionData } from '../Question';
import { QuestionService } from '../question.service';

@Component({
    selector: 'app-delete-confirmation-modal',
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrls: ['./delete-confirmation-modal.component.scss'],
})
export class DeleteConfirmationModalComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteConfirmationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private questioncrud: QuestionService,
        private snackBar: MatSnackBar,
        private answerscrud: AnswersService
    ) {}

    submit(data: QuestionData, form: NgForm): void {
        if (form.submitted) {
            this.answerscrud
                .getAnswers(data.question.question_id)
                .pipe(
                    switchMap(
                        (array: { response: string | Array<AnswerData> }) => {
                            return array.response !== 'no records'
                                ? this.questioncrud.deleteAnswerCollection(
                                      array
                                  )
                                : of(array);
                        }
                    ),
                    switchMap(() => {
                        return this.questioncrud.deleteQuestion(
                            data.question.question_id
                        );
                    })
                )
                .subscribe(
                    (res: { response: string }) => {
                        this.resultSuccess(res, data);
                    },
                    () => {
                        this.resultFailed(data);
                    }
                );
        }
    }

    resultSuccess(res: { response: string }, data: QuestionData): void {
        if (res.response === 'ok') {
            this.snackBar.open('Питання успішно видалене', 'X', {
                duration: 3000,
            });
            this.dialogRef.close({
                finished: true,
                question: data.question,
            });
        }
    }
    resultFailed(data: QuestionData): void {
        this.snackBar.open(
            'Потрібно видалити всі відповіді до даного завдання',
            'X',
            {
                duration: 3000,
            }
        );
        this.dialogRef.close({
            finished: false,
            question: data.question,
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
