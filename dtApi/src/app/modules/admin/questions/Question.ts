import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface QuestionInstance {
    question_id: number;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
}
export interface QuestionData {
    title: string;
    question: QuestionInstance;
}
export interface QuestionDataAfterClosed {
    finished: boolean;
    updatedquestion: QuestionInstance;
}
export interface SuccessData {
    res?: QuestionInstance | { response: string };
    data?: QuestionInstance;
    snackBar: MatSnackBar;
    dialogRef?: MatDialogRef<unknown>;
    message: string;
}
