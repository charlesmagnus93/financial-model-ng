import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';
import { InputPharmaLandingComponent } from './pages/dashboard/input-pharma-landing.component';
import { ModelSetupGuard } from './pages/services/model-setup.guard';
import { PharmaResultsComponent } from './pages/dashboard/pharma-results.component';
import { InputBiotechLandingComponent } from './pages/dashboard/input-biotech-landing.component';
import { BiotechResultsComponent } from './pages/dashboard/biotech-results.component';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Signin },
    { path: 'signup', component: Signup },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'pharma-input-landing', component: InputPharmaLandingComponent },
            { path: 'pharma-results', component: PharmaResultsComponent, canActivate: [ModelSetupGuard] },
            { path: 'biotech-input-landing', component: InputBiotechLandingComponent },
            { path: 'biotech-results', component: BiotechResultsComponent, canActivate: [ModelSetupGuard] }
        ]
    },
];


