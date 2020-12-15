import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'admins',
                loadChildren: () =>
                    import('./admins/admins.module').then(
                        (m) => m.AdminsModule
                    ),
            },
            {
                path: 'speciality',
                loadChildren: () =>
                    import('./speciality/speciality.module').then(
                        (m) => m.SpecialityModule
                    ),
            },
            {
                path: 'faculties',
                loadChildren: () =>
                    import('./faculties/faculties.module').then(
                        (m) => m.FacultiesModule
                    ),
            },
            {
                path: 'group',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./groups/groups.module').then(
                                (m) => m.GroupsModule
                            ),
                    },
                    {
                        path: 'students',
                        loadChildren: () =>
                            import('./students/students.module').then(
                                (m) => m.StudentsModule
                            ),
                    },
                ],
            },
            {
                path: 'about',
                loadChildren: () =>
                    import('./about/about.module').then((m) => m.AboutModule),
            },
            {
                path: 'subjects',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./subjects/subjects.module').then(
                                (m) => m.SubjectsModule
                            ),
                    },
                    {
                        path: 'tests/:id',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import('./test/test.module').then(
                                        (m) => m.TestModule
                                    ),
                            },

                            {
                                path: 'test-detailes',
                                loadChildren: () =>
                                    import(
                                        './test-detailes/test-detailes.module'
                                    ).then((m) => m.TestDetailesModule),
                            },
                            {
                                path: 'questions',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: () =>
                                            import(
                                                './questions/questions.module'
                                            ).then((m) => m.QuestionsModule),
                                    },
                                    {
                                        path: 'answer',
                                        loadChildren: () =>
                                            import(
                                                './answers/answers.module'
                                            ).then((m) => m.AnswersModule),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'timetable',
                        loadChildren: () =>
                            import('./timatable/timatable.module').then(
                                (m) => m.TimatableModule
                            ),
                    },
                ],
            },
            {
                path: 'results',
                loadChildren: () =>
                    import('./results/results.module').then(
                        (m) => m.ResultsModule
                    ),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AdminRoutingModule {}
