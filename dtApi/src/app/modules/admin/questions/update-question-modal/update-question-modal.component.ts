import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
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
    questionTypes: string[] = [
        'Простий вибір',
        'Мульти вибір',
        'Текстове поле',
        'Числове поле вводу',
    ];
    levels = [...Array(20).keys()];
    constructor(
        public dialogRef: MatDialogRef<UpdateQuestionModalComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { question: QuestionInstance; test_id: number },
        private formBuilder: FormBuilder,
        private questionservice: QuestionService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.QuestionUpdateForm = this.formBuilder.group({
            question_text: new FormControl(
                this.data.question ? this.data.question.question_text : null
            ),
            type: new FormControl(
                this.data.question ? this.data.question.type : null
            ),
            level: new FormControl(
                this.data.question ? this.data.question.level : null
            ),
        });
    }
    typeReverse(type: string | number): number | string {
        if (typeof type === 'string') {
            switch (type) {
                case 'Простий вибір':
                    type = 1;
                    break;
                case 'Мульти вибір':
                    type = 2;
                    break;
                case 'Текстове поле':
                    type = 3;
                    break;
                case 'Числове поле вводу':
                    type = 4;
                    break;
            }
        } else if (typeof type === 'number') {
            switch (type) {
                case 1:
                    type = 'Простий вибір';
                    break;
                case 2:
                    type = 'Мульти вибір';
                    break;
                case 3:
                    type = 'Текстове поле';
                    break;
                case 4:
                    type = 'Числове поле вводу';
                    break;
            }
        }

        return type;
    }
    submit(data: { question: QuestionInstance }): void {
        if (this.QuestionUpdateForm.valid) {
            const type = this.QuestionUpdateForm.value.type;
            this.QuestionUpdateForm.value.type = this.typeReverse(type);

            this.questionservice
                .updateQuestion(
                    JSON.stringify(this.QuestionUpdateForm.value),
                    data.question.question_id
                )
                .subscribe((result: any) => {
                    if (!result) return null;
                    this.snackBar.open('Питання було відредаговано', 'Х', {
                        duration: 3000,
                    });
                    const updatedQuestion = {
                        question_id: data.question.question_id,
                        question_text: this.QuestionUpdateForm.value
                            .question_text,
                        type: this.QuestionUpdateForm.value.type,
                        level: this.QuestionUpdateForm.value.level,
                    };
                    this.dialogRef.close({
                        updatedquestion: updatedQuestion,
                        finished: true,
                    });
                });
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
