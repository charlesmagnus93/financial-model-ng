import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';
import { InputLandingComponent } from './pages/dashboard/input-landing.component';

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
            { path: 'input-landing', component: InputLandingComponent },
            { path: 'key-metrics', component: Dashboard },
            { path: 'financial-performance', component: Dashboard },
            { path: 'financial-position', component: Dashboard },
            { path: 'cash-flow', component: Dashboard },
            { path: 'sensitivity-analysis', component: Dashboard },
            { path: 'scenario-ifs', component: Dashboard },
            { path: 'simulation-montecarlo', component: Dashboard },
            { path: 'break-even-payback', component: Dashboard }
        ]
    },
];
