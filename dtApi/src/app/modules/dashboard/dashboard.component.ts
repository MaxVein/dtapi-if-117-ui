import { Component } from '@angular/core'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { OnInit } from '@angular/core'
import { DashboardMetricsService } from './services/dashboard-metrics.service'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DashboardMetricsService],
})
export class DashboardComponent implements OnInit {
    faculties: []
    groups: number
    specialities: number
    subjects: number
    students: number
    admins: number
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
            if (matches) {
                return [
                    {
                        title: 'Факультети',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                        count: this.faculties.length,
                    },
                    { title: 'Групи', cols: 1, rows: 1, icon: 'home' },
                    {
                        title: 'Спеціальності',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                    {
                        title: 'Предмети',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                    {
                        title: 'Студенти',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                    {
                        title: 'Адміни',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                    {
                        title: 'Результати',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                    {
                        title: 'Протокол',
                        cols: 1,
                        rows: 1,
                        url: '/',
                        icon: 'home',
                    },
                ]
            }

            return [
                {
                    title: 'Факультети',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                    count: this.faculties.length,
                },
                { title: 'Групи', cols: 1, rows: 1, icon: 'home' },
                {
                    title: 'Спеціальності',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                },
                {
                    title: 'Предмети',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                },
                {
                    title: 'Студенти',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                },
                {
                    title: 'Адміни',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                },
                {
                    title: 'Результати',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
                },
                {
                    title: 'Протокол',
                    cols: 1,
                    rows: 1,
                    url: '/',
                    icon: 'home',
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
        // this.infoservice.BackendLogin().subscribe((info) => console.log(info))

        this.infoservice
            .getFacultiesNumber()
            .subscribe((facultiesInfo) => (this.faculties = facultiesInfo))
    }
}
