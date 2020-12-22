import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionInstance } from '../Question';
import { QuestionService } from '../question.service';

@Component({
    selector: 'app-update-question-modal',
    templateUrl: './update-question-modal.component.html',
    styleUrls: ['./update-question-modal.component.scss'],
})
export class UpdateQuestionModalComponent implements OnInit {
    QuestionUpdateForm: FormGroup;
    levels = [...Array(20).keys()];
    constructor(
        public dialogRef: MatDialogRef<UpdateQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { question: QuestionInstance },
        private formBuilder: FormBuilder,
        private questionservice: QuestionService,
        private snackBar: MatSnackBar,
        private questionService: QuestionService
    ) {}

    submit(data: { question: QuestionInstance }): void {
        if (this.QuestionUpdateForm.valid) {
            this.questionservice
                .updateQuestion(
                    JSON.stringify(this.QuestionUpdateForm.value),
                    data.question.question_id
                )
                .subscribe(
                    (result: QuestionInstance) =>
                        this.questionService.resultSuccess(
                            {
                                res: result,
                                snackBar: this.snackBar,
                                dialogRef: this.dialogRef,
                                message: 'Питання було відредаговано',
                            },
                            'Update'
                        ),
                    () =>
                        this.questionService.resultFailed({
                            snackBar: this.snackBar,
                            message: 'Потрібно щось змінити',
                        })
                );
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.QuestionUpdateForm = this.formBuilder.group({
            question_text: new FormControl(
                this.data.question ? this.data.question.question_text : null
            ),
            level: new FormControl(
                this.data.question ? this.data.question.level : null
            ),
        });
    }
}
