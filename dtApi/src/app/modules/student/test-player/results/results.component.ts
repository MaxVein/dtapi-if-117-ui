import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestPlayerService } from '../../services/test-player.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { Subscription } from 'rxjs';
import {
    TestPlayerResponse,
    TestPlayerResults,
} from '../../../../shared/interfaces/test-player.interfaces';
import { Response } from '../../../../shared/interfaces/entity.interfaces';
import { resultsMessages, testPlayerServerMessages } from '../../Messages';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
    loading = false;
    testPlayerResults: TestPlayerResults;
    resultsSubscription: Subscription;

    constructor(
        private router: Router,
        private testPlayerService: TestPlayerService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.initTestResults();
    }

    initTestResults(): void {
        this.resultsSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (
                        response.response === 'Empty slot' ||
                        (!response.testPlayerResults && response.currentTest)
                    ) {
                        this.alertService.warning(resultsMessages('emptySlot'));
                        this.alertService.message(resultsMessages('notAccess'));
                        this.router.navigate(['/student/profile']);
                    } else if (response.testPlayerResults) {
                        this.testPlayerResults = response.testPlayerResults;
                        this.loading = false;
                        this.alertService.message(resultsMessages('upload'));
                    }
                },
                (error: Response) => {
                    this.alertService.error(resultsMessages('get'));
                    this.resetSession();
                }
            );
    }

    resetSession(): void {
        this.resultsSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response.response === 'Custom data has been deleted') {
                        this.router.navigate(['/student/profile']);
                    } else {
                        this.alertService.warning(resultsMessages('navigate'));
                        this.router.navigate(['/student/test-player/results']);
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('reset'));
                    this.router.navigate(['/student/profile']);
                }
            );
    }

    ngOnDestroy(): void {
        if (this.resultsSubscription) {
            this.resultsSubscription.unsubscribe();
        }
        sessionStorage.clear();
    }
}
