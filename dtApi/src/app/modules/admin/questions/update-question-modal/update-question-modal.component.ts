import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionInstance, typeReverse } from '../Question';
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
        public data: { question: QuestionInstance },
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

    submit(data: { question: any }): void {
        if (this.QuestionUpdateForm.valid) {
            const type = this.QuestionUpdateForm.value.type;
            this.QuestionUpdateForm.value.type = typeReverse(type);
            this.questionservice
                .updateQuestion(
                    JSON.stringify(this.QuestionUpdateForm.value),
                    data.question.question_id
                )
                .subscribe(
                    (result: QuestionInstance) => this.resultSuccess(result),
                    () => this.resultFailed()
                );
        }
    }
    resultSuccess(res: QuestionInstance): void {
        if (!res) return null;
        this.snackBar.open('Питання було відредаговано', 'X', {
            duration: 3000,
        });
        this.dialogRef.close({
            finished: true,
            updatedquestion: {
                ...res[0],
            },
        });
    }
    resultFailed(): void {
        this.snackBar.open('Потрібно щось змінити', 'X', {
            duration: 3000,
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
