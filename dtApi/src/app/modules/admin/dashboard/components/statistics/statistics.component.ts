import { Component, OnInit } from '@angular/core';
import { DashboardMetricsService } from '../../services/dashboard-metrics.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CardsResponsiveOptions } from './CardsOptions';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    providers: [DashboardMetricsService],
})
export class StatisticsComponent implements OnInit {
    logininfo: string;
    facultiesAmount: number;
    groupsAmount: number;
    specialitiesAmount: number;
    subjectsAmount: number;
    studentsAmount: number;
    adminAmount: number;

    ResponsiveData: CardsResponsiveOptions = {
        breakpoint: 4,
        rowHeight: 400,
        isXLScreen: '(min-width: 1250px)',
        isLGScreen: '(max-width: 1250px)',
        isMDScreen: '(max-width: 1000px)',
        isSMScreen: '(max-width: 760px)',
        isMSScreen: '(max-width: 460px)',
    };
    layoutChangesMedia = this.breakpointObserver.observe([
        this.ResponsiveData.isXLScreen,
        this.ResponsiveData.isLGScreen,
        this.ResponsiveData.isMDScreen,
        this.ResponsiveData.isSMScreen,
        this.ResponsiveData.isMSScreen,
    ]);

    constructor(
        private breakpointObserver: BreakpointObserver,
        private infoservice: DashboardMetricsService
    ) {}

    ngOnInit(): void {
        this.layoutChangesMedia.subscribe((result) => {
            this.layoutChange(result.breakpoints);
        });
        this.infoservice
            .getFacultiesNumber()
            .subscribe(
                (facultiesInfo) => (this.facultiesAmount = facultiesInfo)
            );
        this.infoservice
            .getSubjectsNumber()
            .subscribe((subjectsInfo) => (this.subjectsAmount = subjectsInfo));
        this.infoservice
            .getGroupsNumber()
            .subscribe((groupsInfo) => (this.groupsAmount = groupsInfo));
        this.infoservice
            .getSpecialitiesNumber()
            .subscribe(
                (specialitiesInfo) =>
                    (this.specialitiesAmount = specialitiesInfo)
            );
        this.infoservice
            .getStudentsNumber()
            .subscribe((studentsInfo) => (this.studentsAmount = studentsInfo));
        this.infoservice
            .getAdminsNumber()
            .subscribe((adminsInfo) => (this.adminAmount = adminsInfo));
    }

    layoutChange(result: any): void {
        for (const item in result) {
            if (
                item == this.ResponsiveData.isXLScreen &&
                result[item] === true
            ) {
                this.ResponsiveData.breakpoint = 4;
                this.ResponsiveData.rowHeight = 380;
            } else if (
                item == this.ResponsiveData.isLGScreen &&
                result[item] === true
            ) {
                this.ResponsiveData.breakpoint = 3;
                this.ResponsiveData.rowHeight = 320;
            } else if (
                item == this.ResponsiveData.isMDScreen &&
                result[item] === true
            ) {
                this.ResponsiveData.breakpoint = 3;
                this.ResponsiveData.rowHeight = 280;
            } else if (
                item == this.ResponsiveData.isSMScreen &&
                result[item] === true
            ) {
                this.ResponsiveData.breakpoint = 2;
                this.ResponsiveData.rowHeight = 230;
            } else if (
                item == this.ResponsiveData.isMSScreen &&
                result[item] === true
            ) {
                this.ResponsiveData.breakpoint = 1;
                this.ResponsiveData.rowHeight = 230;
            }
        }
    }
}
