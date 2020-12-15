import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CardsResponsiveOptions } from './CardsOptions';
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
    CARDSDATA: Array<{ title: string; icon: string; count: any; link: string }>;

    ResponsiveData: CardsResponsiveOptions = {
        breakpoint: 4,
        rowHeight: 400,
        isXLScreen: '(min-width: 1250px)',
        isLGScreen: '(max-width: 1250px)',
        isMDScreen: '(max-width: 1000px)',
        isSMScreen: '(max-width: 780px)',
        isMSScreen: '(max-width: 460px)',
    };
    layoutChangesMedia = this.breakpointObserver.observe([
        this.ResponsiveData.isXLScreen,
        this.ResponsiveData.isLGScreen,
        this.ResponsiveData.isMDScreen,
        this.ResponsiveData.isSMScreen,
        this.ResponsiveData.isMSScreen,
    ]);
    layoutChange(result: any): void {
        for (const item in result) {
            if (result[item]) {
                switch (item) {
                    case this.ResponsiveData.isXLScreen:
                        this.ResponsiveData.breakpoint = 4;
                        this.ResponsiveData.rowHeight = 380;
                        break;
                    case this.ResponsiveData.isLGScreen:
                        this.ResponsiveData.breakpoint = 3;
                        this.ResponsiveData.rowHeight = 320;
                        break;
                    case this.ResponsiveData.isMDScreen:
                        this.ResponsiveData.breakpoint = 3;
                        this.ResponsiveData.rowHeight = 280;
                        break;
                    case this.ResponsiveData.isSMScreen:
                        this.ResponsiveData.breakpoint = 2;
                        this.ResponsiveData.rowHeight = 230;
                        break;
                    case this.ResponsiveData.isMSScreen:
                        this.ResponsiveData.breakpoint = 1;
                        break;
                }
            }
        }
    }

    constructor(
        private breakpointObserver: BreakpointObserver,
        private infoservice: DashboardService
    ) {}

    ngOnInit(): void {
        this.layoutChangesMedia.subscribe((result) => {
            this.layoutChange(result.breakpoints);
        });

        this.CARDSDATA = [
            {
                title: 'Факультети',
                icon: 'account_balance',
                count: null,
                link: '/admin/faculties',
            },
            {
                title: 'Групи',
                icon: 'groups',
                count: null,
                link: '/admin/group',
            },
            {
                title: 'Спеціальності',
                icon: 'dns',
                count: null,
                link: '/admin/speciality',
            },
            {
                title: 'Предмети',
                icon: 'collections_bookmark',
                count: null,
                link: '/admin/subjects',
            },
            {
                title: 'Cтуденти',
                icon: 'how_to_reg',
                count: null,
                link: '/admin/group',
            },
            {
                title: 'Адміни',
                icon: 'supervised_user_circle',
                count: null,
                link: '/admin/admins',
            },
            {
                title: 'Результати',
                icon: 'insights',
                count: null,
                link: '/admin/results',
            },
            {
                title: 'Протокол',
                icon: 'contact_page',
                count: null,
                link: '/admin/protocol',
            },
        ];

        forkJoin({
            FacultiesNumber: this.infoservice.getFacultiesNumber(),
            GroupsNumber: this.infoservice.getGroupsNumber(),
            SpecialitiesNumber: this.infoservice.getSpecialitiesNumber(),
            SubjectNumber: this.infoservice.getSubjectsNumber(),
            StudentsNumber: this.infoservice.getStudentsNumber(),
            AdminsNumber: this.infoservice.getAdminsNumber(),
        }).subscribe((result) => {
            this.CARDSDATA.forEach((item, index) => {
                index === 0 ? (item.count = result.FacultiesNumber) : null;
                index === 1 ? (item.count = result.GroupsNumber) : null;
                index === 2 ? (item.count = result.SpecialitiesNumber) : null;
                index === 3 ? (item.count = result.SubjectNumber) : null;
                index === 4 ? (item.count = result.StudentsNumber) : null;
                index === 5 ? (item.count = result.AdminsNumber) : null;
            });
        });
    }
}
