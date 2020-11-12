/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit } from '@angular/core'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { DashboardMetricsService } from './services/dashboard-metrics.service'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DashboardMetricsService],
})
export class DashboardComponent implements OnInit {
    menuIcon = 'menu_open'
    menuIconChange(): void {
        if (this.menuIcon === 'menu_open') {
            this.menuIcon = 'menu'
        } else {
            this.menuIcon = 'menu_open'
        }
    }

    logininfo: object
    facultiesAmount: object
    groupsAmount: object
    specialitiesAmount: object
    subjectsAmount: object
    studentsAmount: object
    adminAmount: object

    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
            if (matches) {
                return [
                    {
                        title: 'Факультети',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'account_balance',
                        count: this.facultiesAmount,
                        link: '/faculties',
                    },
                    {
                        title: 'Групи',
                        cols: 1,
                        rows: 1,
                        url: '/groups',
                        icon: 'groups',
                        count: this.groupsAmount,
                    },
                    {
                        title: 'Спеціальності',
                        cols: 1,
                        rows: 1,
                        url: '/specialities',
                        icon: 'dns',
                        count: this.specialitiesAmount,
                    },
                    {
                        title: 'Предмети',
                        cols: 1,
                        rows: 1,
                        url: '/subjects',
                        icon: 'collections_bookmark',
                        count: this.subjectsAmount,
                    },
                    {
                        title: 'Студенти',
                        cols: 1,
                        rows: 1,
                        url: '/students',
                        icon: 'how_to_reg',
                        count: this.studentsAmount,
                    },
                    {
                        title: 'Адміни',
                        cols: 1,
                        rows: 1,
                        url: '/admins',
                        icon: 'supervised_user_circle',
                        count: this.adminAmount,
                    },
                    {
                        title: 'Результати',
                        cols: 1,
                        rows: 1,
                        url: '/result',
                        icon: 'insights',
                    },
                    {
                        title: 'Протокол',
                        cols: 1,
                        rows: 1,
                        url: '/protocol',
                        icon: 'contact_page',
                    },
                ]
            }
            return [
                {
                    title: 'Факультети',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'account_balance',
                    count: this.facultiesAmount,
                    link: '/faculties',
                },
                {
                    title: 'Групи',
                    cols: 1,
                    rows: 1,
                    url: '/groups',
                    icon: 'groups',
                    count: this.groupsAmount,
                },
                {
                    title: 'Спеціальності',
                    cols: 1,
                    rows: 1,
                    url: '/specialities',
                    icon: 'dns',
                    count: this.specialitiesAmount,
                },
                {
                    title: 'Предмети',
                    cols: 1,
                    rows: 1,
                    url: '/subjects',
                    icon: 'collections_bookmark',
                    count: this.subjectsAmount,
                },
                {
                    title: 'Студенти',
                    cols: 1,
                    rows: 1,
                    url: '/students',
                    icon: 'how_to_reg',
                    count: this.studentsAmount,
                },
                {
                    title: 'Адміни',
                    cols: 1,
                    rows: 1,
                    url: '/admins',
                    icon: 'supervised_user_circle',
                    count: this.adminAmount,
                },
                {
                    title: 'Результати',
                    cols: 1,
                    rows: 1,
                    url: '/result',
                    icon: 'insights',
                },
                {
                    title: 'Протокол',
                    cols: 1,
                    rows: 1,
                    url: '/protocol',
                    icon: 'contact_page',
                },
            ]
        })
    )

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        )
    constructor(
        private breakpointObserver: BreakpointObserver,
        private infoservice: DashboardMetricsService
    ) {}
    ngOnInit(): void {
        if (
            this.infoservice
                .BackendLogin()
                .subscribe((info) => (this.logininfo = info))
        ) {
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
