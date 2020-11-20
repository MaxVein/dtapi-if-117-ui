import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent implements OnInit {
    link: string

    ngOnInit(): void {
        const role = localStorage.getItem('role')
        if (role === 'admin') {
            this.link = '/admin/dashboard'
        } else {
            this.link = '/student/home'
        }
    }
}
