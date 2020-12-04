import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ResultsService } from './results.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
    constructor(private resultService: ResultsService) {}
    displayedColumns: string[] = [
        'id',
        'fullName',
        'rating',
        'data',
        'startTime',
        'duration',
        'statistic',
    ];
    groupId;
    testId;
    groupList;
    testsListByGroup;
    testsList;
    studentsResultsByGroup;
    testResults;
    dataSource = new MatTableDataSource();

    ngOnInit(): void {
        this.resultService.getGroupList().subscribe({
            next: (res) => {
                this.groupList = res;
            },
        });

        this.resultService.getTestsList().subscribe({
            next: (res) => {
                this.testsListByGroup = res;
            },
        });
    }
    onChange($event) {
        this.resultService.getResultTestIdsByGroup($event.value).subscribe({
            next: (res: any) => {
                if (res.response) {
                    this.resultService.snackBarOpen();
                }
                this.groupId = $event.value;
                this.testsList = this.testsListByGroup.filter((i) =>
                    res.some((j) => j.test_id === i.test_id)
                );
            },
        });
    }
    onSubmit() {
        forkJoin([
            this.resultService.getStudentInfo(this.groupId),
            this.resultService.getRecordsByTestDate(this.testId, this.groupId),
        ]).subscribe({
            next: ([gropuRes, testRes]: [[], []]) => {
                this.testResults = testRes;
                this.studentsResultsByGroup = gropuRes;
                this.dataSource.data = this.testResults.map((item) => {
                    const duration = this.resultService.getDuration(
                        item.session_date,
                        item.start_time,
                        item.end_time
                    );

                    const studentInfo = this.studentsResultsByGroup.filter(
                        (data) => data.user_id === item.student_id
                    );
                    return Object.assign({}, item, ...studentInfo, {
                        duration,
                    });
                });
            },
        });
    }

    onChangeTest($event) {
        this.testId = $event.value;
    }
}
