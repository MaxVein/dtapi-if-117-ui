import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { StudentsPageComponent } from './students-page.component';
import { StudentsService } from '../services/students.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { studentsMock } from '../students-mock';
import { AlertService } from '../../../../shared/services/alert.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { studentsMessages } from '../../Messages';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../../../shared/interfaces/entity.interfaces';
import { StudentsModalComponent } from './students-modal/students-modal.component';

describe('StudentsPageComponent', () => {
    let component: StudentsPageComponent;
    let fixture: ComponentFixture<StudentsPageComponent>;
    let router: Router;
    let debugElement: DebugElement;
    let studentsService: StudentsService;
    let modalService: ModalService;
    let alertService: AlertService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentsPageComponent],
            imports: [
                SharedModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([
                    {
                        path: 'admin/group',
                        component: StudentsPageComponent,
                    },
                ]),
                BrowserAnimationsModule,
            ],
            providers: [StudentsService, ModalService, AlertService],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.get(Router);
        spyOn(router, 'getCurrentNavigation').and.returnValue({
            extras: { state: { groupName: 'ІПмз-20-1', id: 1 } },
        } as any);
        spyOn(router, 'navigate').and.stub();
        fixture = TestBed.createComponent(StudentsPageComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        studentsService = TestBed.get(StudentsService);
        spyOn(studentsService, 'create');
        modalService = TestBed.get(ModalService);
        spyOn(modalService, 'openModal');
        alertService = TestBed.get(AlertService);
        spyOn(alertService, 'message');
        spyOn(alertService, 'warning');
        spyOn(alertService, 'error');
        spyOn(component, 'initGroupInfo');
        spyOn(component, 'ngOnInit');
        spyOn(component, 'getStudentsByGroup');
        spyOn(component, 'add');
        spyOn(component.studentSubscription, 'unsubscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title Students and GroupName', () => {
        const title = debugElement.query(By.css('.entity-header > h1'));
        const icon = debugElement.query(By.css('.entity-title-icon'));
        expect(title).toBeTruthy();
        expect(icon).toBeTruthy();
        expect(component.groupName).toBe('ІПмз-20-1');
        expect(icon.nativeElement.textContent).toContain('how_to_reg');
        expect(title.nativeElement.textContent).toContain('Студенти групи');
    });

    it('should display add button', () => {
        const btn = debugElement.query(By.css('.entity-header > button'));
        const icon = debugElement.query(By.css('.entity-btn-icon'));
        expect(btn).toBeTruthy();
        expect(icon).toBeTruthy();
        expect(icon.nativeElement.textContent).toContain('add_circle');
        expect(btn.nativeElement.textContent).toContain('Додати студента');
    });

    it('should alert and error modal working', () => {
        modalService.openModal(AlertComponent, {});
        alertService.message('Test');
        alertService.warning('Test');
        alertService.error('Test');
        expect(alertService.error).toHaveBeenCalled();
        expect(alertService.warning).toHaveBeenCalled();
        expect(alertService.message).toHaveBeenCalled();
        expect(modalService.openModal).toHaveBeenCalled();
    });

    it('navigation extras', () => {
        component.initGroupInfo();
        alertService.error(studentsMessages('extrasError'));
        router.navigate(['/admin/group']);
        expect(component.initGroupInfo).toHaveBeenCalled();
        expect(component.groupID).not.toBeNull();
        expect(component.groupName).not.toBeNull();
        expect(component.groupID).toEqual(jasmine.any(Number));
        expect(component.groupName).toEqual(jasmine.any(String));
        expect(component.groupID).toBe(1);
        expect(component.groupName).toBe('ІПмз-20-1');
        const groupName = JSON.parse(localStorage.getItem('group_name'));
        const groupID = JSON.parse(localStorage.getItem('group_id'));
        expect(groupName).toBe('ІПмз-20-1');
        expect(groupID).toBe(1);
        expect(alertService.error).toHaveBeenCalledWith(
            studentsMessages('extrasError')
        );
        expect(router.navigate).toHaveBeenCalledWith(['/admin/group']);
    });

    it('ngOnInit', () => {
        const loader = debugElement.query(By.css('.students__loader'));
        component.initGroupInfo();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.initGroupInfo).toHaveBeenCalled();
        expect(component.initGroupInfo).toBeTruthy();
        expect(component.loading).toBeTruthy();
        expect(loader).toBeTruthy();
        expect(component.getStudentsByGroup).toBeTruthy();
    });

    it('get students by group', () => {
        alertService.error(studentsMessages('getError'));
        alertService.message(studentsMessages('upload'));
        alertService.message(studentsMessages('notStudents'));
        router.navigate(['/admin/group']);
        component.initGroupInfo();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.initGroupInfo).toHaveBeenCalled();
        expect(component.loading).toBeTruthy();
        component.getStudentsByGroup();
        expect(component.getStudentsByGroup).toHaveBeenCalled();
        component.dataSource = new MatTableDataSource<Student>();
        expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
        expect(component.dataSource.data).toEqual(jasmine.any(Array));
        component.dataSource.data = studentsMock;
        fixture.detectChanges();
        expect(component.dataSource.data.length).toBe(1);
        expect(component.dataSource.data[0]).toEqual(studentsMock[0]);
        expect(alertService.message).toHaveBeenCalledWith(
            studentsMessages('upload')
        );
        expect(alertService.message).toHaveBeenCalledWith(
            studentsMessages('notStudents')
        );
        expect(alertService.error).toHaveBeenCalledWith(
            studentsMessages('getError')
        );
        expect(router.navigate).toHaveBeenCalledWith(['/admin/group']);
    });

    describe('should open add student modal', () => {
        it('should call add', fakeAsync(() => {
            modalService.openModal(StudentsModalComponent, {});
            component.initGroupInfo();
            component.ngOnInit();
            component.getStudentsByGroup();
            expect(component.ngOnInit).toHaveBeenCalled();
            expect(component.initGroupInfo).toHaveBeenCalled();
            expect(component.getStudentsByGroup).toHaveBeenCalled();
            const addBtn = fixture.debugElement.nativeElement.querySelector(
                '.entity-btn'
            );
            addBtn.click();
            tick();
            expect(component.isUpdateData).toBe(false);
            expect(component.add).toHaveBeenCalled();
            expect(modalService.openModal).toHaveBeenCalled();
            expect(component.isUpdateData).toBeFalsy();
            expect(component.groupID).toBe(1);
        }));

        it('should add element', () => {
            component.add();
            expect(component.add).toHaveBeenCalled();
            studentsService.create(studentsMock[0]);
            expect(studentsService.create).toHaveBeenCalledWith(
                studentsMock[0]
            );
            component.dataSource.data.unshift(studentsMock[0]);
            expect(component.dataSource.data.length).toBe(1);
            alertService.message(studentsMessages('add'));
            expect(alertService.message).toHaveBeenCalledWith(
                studentsMessages('add')
            );
            alertService.message(studentsMessages('modalCancel'));
            expect(alertService.message).toHaveBeenCalledWith(
                studentsMessages('modalCancel')
            );
            alertService.message(studentsMessages('modalError'));
            expect(alertService.message).toHaveBeenCalledWith(
                studentsMessages('modalError')
            );
        });
    });

    it('ngOnDestroy', () => {
        fixture.detectChanges();
        component.ngOnDestroy();
        expect(component.studentSubscription.unsubscribe).toHaveBeenCalledTimes(
            1
        );
    });
});
