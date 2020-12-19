import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { ResultsComponent } from './test-player/results/results.component';

const routes: Routes = [
    {
        path: '',
        component: StudentComponent,
        children: [
            {
                path: 'profile',
                loadChildren: () =>
                    import('./profile-page/profile.module').then(
                        (m) => m.ProfileModule
                    ),
            },
            {
                path: 'test-player',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./test-player/test-player.module').then(
                                (m) => m.TestPlayerModule
                            ),
                    },
                    {
                        path: 'results',
                        component: ResultsComponent,
                    },
                ],
            },
            {
                path: '',
                redirectTo: 'profile',
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
export class StudentRoutingModule {}
