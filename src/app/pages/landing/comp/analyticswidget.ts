import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArrowRight, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'analytics-widget',
    standalone: true,
    imports: [LucideAngularModule, CommonModule],
    template:`
    <section id="analytics" class="py-20 lg:py-28 bg-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">

            <!-- Left Content -->
            <div class="space-y-6">
                <div class="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full">
                Analytics Engine
                </div>

                <h2 class="text-gray-900">Turn Data Into Actionable Insights</h2>

                <p class="text-gray-600 text-lg">
                Our reproducible analytical engine processes thousands of assumptions and
                variables to deliver precise financial projections you can trust.
                </p>

                <div class="space-y-6 pt-4">
                <div
                    *ngFor="let metric of metrics"
                    class="border-l-4 border-blue-600 pl-4"
                >
                    <div class="text-gray-900">{{ metric.value }}</div>
                    <div class="text-gray-900">{{ metric.label }}</div>
                    <p class="text-gray-600">{{ metric.description }}</p>
                </div>
                </div>

                <button
                class="group mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                Explore Analytics
                <lucide-icon
                    [img]="ArrowRight"
                    class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                ></lucide-icon>
                </button>
            </div>

            <!-- Right Content — Image -->
            <div class="relative">
                <div class="rounded-2xl overflow-hidden shadow-xl">
                <img
                    src="/images/analytics.jpg"
                    alt="Business Analytics Charts"
                    class="w-full h-auto"
                    (error)="onImageError($event)"
                />
                </div>
            </div>

            </div>
        </div>
        </section>

    `
})
export class AnalyticsWidget {

    ArrowRight = ArrowRight;

    metrics = [
        {
        value: '85%',
        label: 'Faster Decision Making',
        description: 'Reduce analysis time from weeks to hours',
        },
        {
        value: '40%',
        label: 'Cost Reduction',
        description: 'Lower operational expenses through automation',
        },
        {
        value: '2.5x',
        label: 'ROI Improvement',
        description: 'Better investment decisions yield higher returns',
        },
    ];

    fallbackImage = 'https://via.placeholder.com/1000x600.png?text=Analytics+Preview+Unavailable';

    onImageError(event: Event) {
        (event.target as HTMLImageElement).src = this.fallbackImage;
    }
}