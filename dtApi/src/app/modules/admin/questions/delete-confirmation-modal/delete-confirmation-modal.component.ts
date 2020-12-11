import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnswersService } from '../../answers/answers.service';
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

    submit(data: any, form: NgForm): void {
        if (form.submitted) {
            this.answerscrud
                .getAnswers(data.question.question_id)
                .subscribe((result: any) => {
                    if (Array.isArray(result)) {
                        let finishedClean = false;
                        result.forEach((element: any) => {
                            this.answerscrud
                                .deleteAnswer(element.answer_id)
                                .subscribe((res) => (finishedClean = true));
                            console.warn(finishedClean);
                        });
                        if (finishedClean) {
                            this.questioncrud
                                .deleteQuestion(data.question.question_id)
                                .subscribe(
                                    (res) => {
                                        this.resultSuccess(res, data);
                                    },
                                    (err) => {
                                        this.resultFailed(err, data);
                                    }
                                );
                        }
                    } else {
                        this.questioncrud
                            .deleteQuestion(data.question.question_id)
                            .subscribe((res) => {
                                this.resultSuccess(res, data);
                            });
                    }
                });
        }
    }
    resultSuccess(res: any, data: any): void {
        if (res.response === 'ok') {
            this.snackBar.open('Question was successfully deleted', 'X', {
                duration: 2000,
            });
            this.dialogRef.close({
                finished: true,
                question: data.question,
            });
        }
    }
    resultFailed(err, data: any): void {
        this.snackBar.open(
            'Потрібно видалити всі відповіді до даного завдання',
            'X',
            {
                duration: 2000,
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
