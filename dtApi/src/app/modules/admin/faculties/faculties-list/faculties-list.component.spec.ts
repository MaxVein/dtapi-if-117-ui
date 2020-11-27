import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultiesListComponent } from './faculties-list.component';

describe('FacultiesListComponent', () => {
    let component: FacultiesListComponent;
    let fixture: ComponentFixture<FacultiesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FacultiesListComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FacultiesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
