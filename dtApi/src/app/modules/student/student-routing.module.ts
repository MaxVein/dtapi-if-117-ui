import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentComponent } from './student.component';

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
                loadChildren: () =>
                    import('./test-player/test-player.module').then(
                        (m) => m.TestPlayerModule
                    ),
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
