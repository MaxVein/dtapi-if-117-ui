import { Component, HostBinding, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent implements OnInit {
    @HostBinding('class') componentCssClass;
    link: string;

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {
        this.componentCssClass = this.themeService.initTheme();
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            this.link = '/admin';
        } else {
            this.link = '/student';
        }
    }
}
