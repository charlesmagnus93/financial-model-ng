import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Signin },
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard }
        ]
    },
];
