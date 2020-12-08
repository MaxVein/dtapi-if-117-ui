import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pluck } from 'rxjs/operators';
import { AddUpdateModalComponent } from '../add-update-modal/add-update-modal.component';
import { QuestionService } from '../question.service';

@Component({
    selector: 'app-delete-confirmation-modal',
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrls: ['./delete-confirmation-modal.component.scss'],
})
export class DeleteConfirmationModalComponent {
    constructor(
        public dialogRef: MatDialogRef<AddUpdateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private questioncrud: QuestionService,
        private snackBar: MatSnackBar
    ) {}

    submit(data: any, form: NgForm): void {
        if (form.submitted) {
            this.questioncrud
                .deleteQuestion(data.question.question_id)
                .pipe(pluck('response'))
                .subscribe((res) => {
                    if (res === 'ok') {
                        this.snackBar.open(
                            'Question was successfully deleted',
                            '/&#10006',
                            {
                                duration: 3000,
                            }
                        );
                        this.dialogRef.close({
                            finished: true,
                            question: data.question,
                        });
                    }
                });
        } else {
            this.dialogRef.close({
                finished: false,
                question: data.question,
            });
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
