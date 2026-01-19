import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HeroWidget } from './comp/herowidget';
import { HeaderWidget } from './comp/headerwidget';
import { FeaturesWidget } from './comp/featureswidget';
import { AnalyticsWidget } from './comp/analyticswidget';
// import { CTAWidget } from './comp/ctawidget';
import { FooterWidget } from './comp/footerwidget';
// import { TestimonialWidget } from './comp/testimonialwidget';
import { IndustriesWidget } from './comp/industrieswidget';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    HeroWidget,
    HeaderWidget,
    FeaturesWidget,
    AnalyticsWidget,
    // CTAWidget,
    FooterWidget,
    // TestimonialWidget,
    IndustriesWidget,
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900">
      <div id="home" class="landing-wrapper overflow-hidden">
        <header-widget />
        <!-- <main> -->
        <hero-widget />
        <features-widget />
        <analytics-widget />
        <!-- <cta-widget /> -->
        <!-- <testimonial-widget /> -->
        <industries-widget />
        <!-- </main> -->
        <footer-widget />
      </div>
    </div>
  `,
})
export class Landing {}
