import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { ModalService } from 'src/app/shared/services/modal.service';

import { ImportExportService } from './import-export.service';

export interface DialogData {
    test_id: string;
}
export interface Records {
    numberOfRecords: string;
}
export interface QuestionInstance {
    question_id: number;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    answers?: any;
}

@Component({
    selector: 'app-import-export-dialog',
    templateUrl: './import-export-dialog.component.html',
    styleUrls: ['./import-export-dialog.component.scss'],
})
export class ImportExportDialogComponent implements OnInit {
    isExport = false;
    isImport = false;
    count: string;
    questions: [];
    questionsIds: [];
    testFullData: any = [];
    ieForm: FormGroup;
    file: any;
    fileData: any;
    questionsImportData: Array<QuestionInstance> = [];
    answersImportData: any = [];

    constructor(
        public dialogRef: MatDialogRef<ImportExportDialogComponent>,
        private ieService: ImportExportService,
        private modalService: ModalService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.ieForm = new FormGroup({
            atachment: new FormControl(),
        });
    }
    exportTests() {
        this.isExport = true;
        this.ieService
            .getCount('question', this.data.test_id)
            .pipe(
                mergeMap((res: Records) => {
                    this.count = res.numberOfRecords;
                    return this.ieService
                        .getQuestions('question', this.data.test_id, this.count)
                        .pipe(
                            mergeMap((item) => {
                                this.questions = item;
                                this.questionsIds = item.map((item) => {
                                    return item.question_id;
                                });
                                const observables = this.questionsIds.map(
                                    (id) =>
                                        this.ieService.getAnswers('answer', id)
                                );
                                return forkJoin(observables);
                            })
                        );
                })
            )
            .subscribe((res) => {
                this.questions.forEach((item: any) => {
                    res.forEach((elem: any) => {
                        if (item.question_id === elem[0].question_id) {
                            this.testFullData.push({
                                ...item,
                                answers: elem,
                            });
                        }
                    });
                });
                const blob = new Blob(
                    [JSON.stringify(this.testFullData, null, 2)],
                    {
                        type: 'text/json',
                    }
                );

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.json');
                link.click();
            });
    }
    importTests() {
        this.isImport = true;
    }
    fileUpload(e) {
        this.file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.fileData = JSON.parse(fileReader.result.toString());
            this.insertQuestions(this.fileData);
        };
        fileReader.readAsText(this.file);
    }
    insertQuestions(fileData) {
        fileData.map((item: QuestionInstance) => {
            this.answersImportData.push([...item.answers]);
            delete item.answers;
            delete item.question_id;
            return item;
        });
        of(fileData)
            .pipe(
                mergeMap((res) => {
                    const quwstionsObservables = res.map((item) =>
                        this.ieService.insertData('question', item)
                    );

                    return forkJoin(quwstionsObservables);
                })
            )
            .pipe(
                mergeMap((res: any) => {
                    const newAnswers = [];

                    this.answersImportData.forEach((item, ind) => {
                        item.forEach((elem) => {
                            newAnswers.push({
                                ...elem,
                                question_id: res[ind][0].question_id,
                            });
                        });
                    });
                    const answersObservables = newAnswers.map((item) => {
                        delete item.answer_id;
                        return this.ieService.insertData('answer', item);
                    });
                    return forkJoin(answersObservables);
                })
            )
            .subscribe((res) => {
                this.dialogRef.close();
                this.modalService.showSnackBar('Тести Імпортовано');
            });
    }
}
