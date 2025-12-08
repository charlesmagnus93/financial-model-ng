import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'industries-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-20 lg:py-28 bg-gray-100">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div class="max-w-3xl mb-12">
            <h2 class="text-gray-900 mb-4">Trusted across industries</h2>
            <p class="text-gray-700">
                From higher education and healthcare to energy and government, PharmaFinance helps teams
                across industries surface insights faster, act with confidence, and scale impact—powered by
                tools designed for the way they work and enhanced by AI.
            </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
                *ngFor="let industry of industries"
                class="group relative h-32 rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
            >
                <img
                [src]="industry.image"
                [alt]="industry.name"
                class="w-full h-full object-cover"
                (error)="onImageError($event)"
                />

                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                <div class="absolute bottom-0 left-0 right-0 p-4">
                <span class="text-white">
                    {{ industry.name }}
                </span>
                </div>
            </div>
            </div>

        </div>
    </section>
`
})
export class IndustriesWidget {
    industries = [
        {
        name: 'Financial services',
        image:
            '/images/financial.jpg',
        },
        {
        name: 'Aerospace and defense',
        image:
            '/images/aerospace.jpg',
        },
        {
        name: 'Energy and utilities',
        image:
            '/images/energy.jpg',
        },
        {
        name: 'Government and public sector',
        image:
            '/images/government.jpg',
        },
        {
        name: 'Manufacturing',
        image:
            '/images/manufacturing.jpg',
        },
        {
        name: 'Construction and engineering',
        image:
            '/images/engineering.jpg',
        },
        {
        name: 'Transportation and logistics',
        image:
            '/images/transportation.jpg',
        },
        {
        name: 'Research and development',
        image:
            '/images/research.jpg',
        },
        {
        name: 'Higher education',
        image:
            '/images/education.jpg',
        },
        {
        name: 'Healthcare',
        image:
            '/images/healthcare.jpg',
        },
  ];

    fallbackImage =
        'https://via.placeholder.com/500x300.png?text=Image+Unavailable';

    onImageError(event: Event) {
        (event.target as HTMLImageElement).src = this.fallbackImage;
    }
}