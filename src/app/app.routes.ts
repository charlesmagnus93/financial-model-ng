import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';
import { InputLandingComponent } from './pages/dashboard/input-landing.component';
import { ModelSetupGuard } from './pages/services/model-setup.guard';
import { PharmaResultsComponent } from './pages/dashboard/pharma-results.component';

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
            { path: 'pharma-input-landing', component: InputLandingComponent },
            { path: 'pharma-results', component: PharmaResultsComponent, canActivate: [ModelSetupGuard] }
        ]
    },
];
