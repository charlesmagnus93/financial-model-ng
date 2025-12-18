import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Signin },
    { path: 'signup', component: Signup },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard }
        ]
    },
];
