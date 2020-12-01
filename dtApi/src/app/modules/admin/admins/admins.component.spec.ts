import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsComponent } from './admins.component';

describe('AdminsTemplateComponent', () => {
    let component: AdminsComponent;
    let fixture: ComponentFixture<AdminsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});