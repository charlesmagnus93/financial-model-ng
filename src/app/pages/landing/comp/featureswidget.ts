import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ChartBar,
  Brain,
  Database,
  Lock,
  LucideAngularModule,
  TrendingUp,
  Zap
} from 'lucide-angular';


@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [LucideAngularModule, CommonModule],
    template: `
    <section id="features" class="py-20 lg:py-28 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <!-- Header -->
            <div class="text-center max-w-3xl mx-auto mb-16">
            <div class="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
                Features
            </div>

            <h2 class="text-gray-900 mb-4">
                Everything You Need for Pharmaceutical Financial Modeling
            </h2>

            <p class="text-gray-600 text-lg">
                Our platform combines cutting-edge technology with deep pharmaceutical industry
                expertise to deliver unparalleled financial modeling capabilities.
            </p>
            </div>

            <!-- Features Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
                *ngFor="let feature of features"
                class="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
                <div class="inline-flex p-3 rounded-lg mb-4" [ngClass]="feature.color">
                <lucide-icon [img]="feature.icon" class="h-6 w-6"></lucide-icon>
                </div>

                <h3 class="text-gray-900 mb-2">{{ feature.title }}</h3>
                <p class="text-gray-600">{{ feature.description }}</p>
            </div>
            </div>

        </div>
    </section>
    `  
})
export class FeaturesWidget {

    features = [
        {
        icon: Brain,
        title: 'AI-Powered Forecasting',
        description:
            'Advanced machine learning algorithms predict market trends and optimize financial outcomes with 98% accuracy.',
        color: 'bg-blue-100 text-blue-600',
        },
        {
        icon: Database,
        title: 'Comprehensive Data Integration',
        description:
            'Seamlessly integrate clinical trial data, market research, and financial assumptions into one unified platform.',
        color: 'bg-purple-100 text-purple-600',
        },
        {
        icon: ChartBar,
        title: 'Interactive Dashboards',
        description:
            'Visualize complex pharmaceutical financial models with intuitive, real-time dashboards and custom reports.',
        color: 'bg-green-100 text-green-600',
        },
        {
        icon: TrendingUp,
        title: 'Scenario Analysis',
        description:
            'Model multiple scenarios including best-case, worst-case, and base-case projections for strategic planning.',
        color: 'bg-orange-100 text-orange-600',
        },
        {
        icon: Zap,
        title: 'Real-Time Calculations',
        description:
            'Instantly recalculate NPV, IRR, and ROI as you adjust assumptions, saving hundreds of hours of manual work.',
        color: 'bg-yellow-100 text-yellow-600',
        },
        {
        icon: Lock,
        title: 'Enterprise Security',
        description:
            'Bank-level encryption and compliance with FDA, HIPAA, and international data protection regulations.',
        color: 'bg-red-100 text-red-600',
        },
    ];
}