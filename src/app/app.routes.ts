import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Landing } from './pages/landing/landing';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { AuthGuard } from './pages/services/auth.guard';
import { Signup } from './pages/signup/signup';
import { InputLandingComponent } from './pages/dashboard/input-landing.component';
import { KeyMetricsComponent } from './pages/dashboard/key-metrics.component';
import { FinancialPositionComponent } from './pages/dashboard/financial-position.component';
import { FinancialPerformanceComponent } from './pages/dashboard/financial-performance.component';
import { CashFlowComponent } from './pages/dashboard/cash-flow.component';
import { SensitivityAnalysisComponent } from './pages/dashboard/sensitivity-analysis.component';
import { ScenarioIfsComponent } from './pages/dashboard/scenario-ifs.component';
import { MonteCarloSimulationComponent } from './pages/dashboard/simulation-montecarlo.component';
import { BreakEvenPaybackComponent } from './pages/dashboard/break-even-payback.component';

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
            { path: 'pharma-key-metrics', component: KeyMetricsComponent },
            { path: 'pharma-financial-performance', component: FinancialPerformanceComponent },
            { path: 'pharma-financial-position', component: FinancialPositionComponent },
            { path: 'pharma-cash-flow', component: CashFlowComponent },
            { path: 'pharma-sensitivity-analysis', component: SensitivityAnalysisComponent },
            { path: 'pharma-scenario-ifs', component: ScenarioIfsComponent },
            { path: 'pharma-simulation-montecarlo', component: MonteCarloSimulationComponent },
            { path: 'pharma-break-even-payback', component: BreakEvenPaybackComponent }
        ]
    },
];
