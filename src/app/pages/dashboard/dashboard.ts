import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    TabsModule,
    ButtonModule,
  ],
  template: `

    <router-outlet></router-outlet>
  `,
})
export class Dashboard implements OnInit, OnDestroy {
  sections = [
    { key: 'input', label: 'Input Landing Page' },
    { key: 'metrics', label: 'Key Metrics Dashboard' },
    { key: 'performance', label: 'Financial Performance' },
    { key: 'position', label: 'Financial Position' },
    { key: 'cashflow', label: 'Cash Flow Statement' },
    { key: 'sensitivity', label: 'Sensitivity Analysis' },
    { key: 'scenario', label: 'Scenario / IFs Analysis' },
    { key: 'montecarlo', label: 'Monte Carlo Simulation' },
    { key: 'breakeven', label: 'Break-even & Payback' },
  ];

  activeTab = 'input';

  private queryParamSub?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const section = params.get('section');
      if (section && this.sections.some((s) => s.key === section)) {
        this.activeTab = section;
      } else {
        this.activeTab = 'input';
      }
    });
  }

  onTabChange(key: string | number) {
    this.activeTab = String(key);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: this.activeTab },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub?.unsubscribe();
  }

  exportModel(): void {}
}
