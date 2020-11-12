import { Component, OnInit } from '@angular/core'
import { TestService } from './services/test.service'

import { Test } from './models/Test'

@Component({
    selector: 'app-tests',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    tests: Test[] = []

    constructor(private testService: TestService) {}

    ngOnInit(): void {
        this.testService.getEntity('test').subscribe((data: Test[]) => {
            this.tests = data
            console.log(data)
        })
    }
}
