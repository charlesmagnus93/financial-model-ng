import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
// import { TopbarWidget } from './components/topbarwidget';
// import { HeroWidget } from './components/herowidget';
// import { FeaturesWidget } from './components/featureswidget';
// import { HighlightsWidget } from './components/highlightswidget';
// import { PricingWidget } from './components/pricingwidget';
// import { FooterWidget } from './components/footerwidget';
import { HeroWidget } from './comp/herowidget';
import { HeaderWidget } from "./comp/headerwidget";
import { FeaturesWidget } from "./comp/featureswidget";
import { AnalyticsWidget } from "./comp/analyticswidget";
import { CTAWidget } from "./comp/ctawidget";
import { FooterWidget } from "./comp/footerwidget";
import { TestimonialWidget } from "./comp/testimonialwidget";
import { IndustriesWidget } from "./comp/industrieswidget";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
    RouterModule,
    // TopbarWidget, 
    // HeroWidget, 
    // FeaturesWidget, 
    // HighlightsWidget, 
    // PricingWidget, 
    // FooterWidget, 
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
    HeroWidget,
    HeaderWidget,
    FeaturesWidget,
    AnalyticsWidget,
    CTAWidget,
    FooterWidget,
    TestimonialWidget,
    IndustriesWidget
],
    // template: `
    //     <div class="bg-surface-0 dark:bg-surface-900">
    //         <div id="home" class="landing-wrapper overflow-hidden">
    //             <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
    //             <hero-widget />
    //             <features-widget />
    //             <highlights-widget />
    //             <pricing-widget />
    //             <footer-widget />
    //         </div>
    //     </div>
    // `
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
    `
    
})
export class Landing {}

/**
 template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                <div class="flex items-center">
                    <a href="/" class="flex items-center gap-2">
                    <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white">Rx</span>
                    </div>
                    <span class="text-gray-900">PharmaFinance</span>
                    </a>
                </div>

                <div class="hidden md:flex md:items-center md:gap-8">
                    <a href="#features" class="text-gray-700 hover:text-blue-600 transition-colors">
                    Features
                    </a>
                    <a href="#solutions" class="text-gray-700 hover:text-blue-600 transition-colors">
                    Solutions
                    </a>
                    <a href="#analytics" class="text-gray-700 hover:text-blue-600 transition-colors">
                    Analytics
                    </a>
                    <a href="#pricing" class="text-gray-700 hover:text-blue-600 transition-colors">
                    Pricing
                    </a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors">
                    About
                    </a>
                </div>

                <!-- CTA Buttons  -->
                <div class="hidden md:flex md:items-center md:gap-4">
                    <Button variant="ghost">Sign In</Button>
                    <Button>Request Demo</Button>
                </div>
                </div>
            </nav>
        </header>
    `
 * 
 */
