import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';
import { ModelSetupGuard } from './pages/services/model-setup.guard';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Signin },
    { path: 'signup', component: Signup },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./pages/account/account-profile.component').then(
                        (m) => m.AccountProfileComponent
                    ),
            },
            {
                path: 'pharma-input-landing',
                loadComponent: () =>
                    import('./pages/dashboard/input-pharma-landing.component').then(
                        (m) => m.InputPharmaLandingComponent
                    ),
            },
            {
                path: 'pharma-results',
                loadComponent: () =>
                    import('./pages/dashboard/pharma-results.component').then(
                        (m) => m.PharmaResultsComponent
                    ),
                canActivate: [ModelSetupGuard],
            },
            {
                path: 'biotech-input-landing',
                loadComponent: () =>
                    import('./pages/dashboard/input-biotech-landing.component').then(
                        (m) => m.InputBiotechLandingComponent
                    ),
            },
            {
                path: 'biotech-results',
                loadComponent: () =>
                    import('./pages/dashboard/biotech-results.component').then(
                        (m) => m.BiotechResultsComponent
                    ),
                canActivate: [ModelSetupGuard],
            },
        ]
    },
];


