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
        private questionService: QuestionService,
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
                                ? this.questionService.deleteAnswerCollection(
                                      array
                                  )
                                : of(array);
                        }
                    ),
                    switchMap(() => {
                        return this.questionService.deleteQuestion(
                            data.question.question_id
                        );
                    })
                )
                .subscribe(
                    (res: { response: string }) => {
                        this.questionService.resultSuccess(
                            {
                                res: res,
                                snackBar: this.snackBar,
                                dialogRef: this.dialogRef,
                                data: data.question,
                                message: 'Питання успішно видалене',
                            },
                            'Delete'
                        );
                    },
                    () => {
                        this.questionService.resultFailed(
                            {
                                snackBar: this.snackBar,
                                data: data.question,
                                message:
                                    'Потрібно видалити всі відповіді до даного завдання',
                            },
                            'Delete'
                        );
                    }
                );
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
