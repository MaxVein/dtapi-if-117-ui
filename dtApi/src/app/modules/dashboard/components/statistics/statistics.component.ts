/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit } from '@angular/core'
import { DashboardMetricsService } from '../../services/dashboard-metrics.service'
import { BreakpointObserver } from '@angular/cdk/layout'
import { CardsResponsiveOptions } from './CardsOptions'

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss'],
    providers: [DashboardMetricsService],
})
export class StatisticsComponent implements OnInit {
    logininfo: string
    facultiesAmount: number
    groupsAmount: number
    specialitiesAmount: number
    subjectsAmount: number
    studentsAmount: number
    adminAmount: number

    ResponsiveData: CardsResponsiveOptions = {
        breakpoint: 4,
        rowHeight: 400,
        isXLScreen: '(min-width: 1250px)',
        isLGScreen: '(max-width: 1250px)',
        isMDScreen: '(max-width: 1000px)',
        isSMScreen: '(max-width: 700px)',
    }
    layoutChangesMedia = this.breakpointObserver.observe([
        this.ResponsiveData.isXLScreen,
        this.ResponsiveData.isLGScreen,
        this.ResponsiveData.isMDScreen,
        this.ResponsiveData.isSMScreen,
    ])
    layoutChange(result: object): void {
        for (const item in result) {
            if (
                item == this.ResponsiveData.isXLScreen &&
                result[item] == true
            ) {
                this.ResponsiveData.breakpoint = 4
                this.ResponsiveData.rowHeight = 400
            } else if (
                item == this.ResponsiveData.isLGScreen &&
                result[item] == true
            ) {
                this.ResponsiveData.breakpoint = 3
                this.ResponsiveData.rowHeight = 400
            } else if (
                item == this.ResponsiveData.isMDScreen &&
                result[item] == true
            ) {
                this.ResponsiveData.breakpoint = 2
                this.ResponsiveData.rowHeight = 350
            } else if (
                item == this.ResponsiveData.isSMScreen &&
                result[item] == true
            ) {
                this.ResponsiveData.breakpoint = 1
                this.ResponsiveData.rowHeight = 300
            }
        }
    }

    constructor(
        private breakpointObserver: BreakpointObserver,
        private infoservice: DashboardMetricsService
    ) {}

    ngOnInit(): void {
        this.layoutChangesMedia.subscribe((result) => {
            this.layoutChange(result.breakpoints)
        })

        // this.infoservice
        //     .BackendLogin()
        //     .subscribe((info) => (this.logininfo = info))

        {
            this.infoservice
                .getFacultiesNumber()
                .subscribe(
                    (facultiesInfo) =>
                        (this.facultiesAmount = facultiesInfo.numberOfRecords)
                )
            this.infoservice
                .getSubjectsNumber()
                .subscribe(
                    (subjectsInfo) =>
                        (this.subjectsAmount = subjectsInfo.numberOfRecords)
                )
            this.infoservice
                .getGroupsNumber()
                .subscribe(
                    (groupsInfo) =>
                        (this.groupsAmount = groupsInfo.numberOfRecords)
                )
            this.infoservice
                .getSpecialitiesNumber()
                .subscribe(
                    (specialitiesInfo) =>
                        (this.specialitiesAmount =
                            specialitiesInfo.numberOfRecords)
                )
            this.infoservice
                .getStudentsNumber()
                .subscribe(
                    (studentsInfo) =>
                        (this.studentsAmount = studentsInfo.numberOfRecords)
                )
            this.infoservice
                .getAdminsNumber()
                .subscribe(
                    (adminsInfo) =>
                        (this.adminAmount = adminsInfo.numberOfRecords)
                )
        }
    }
}
