import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-fallback',
  standalone: true,
  imports: [],
  template: `
    <section id="solutions" class="py-20 lg:py-28 bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">

            <!-- Image -->
            <div class="order-2 lg:order-1">
                <div class="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                    [src]="imageUrl"
                    alt="Pharmaceutical Laboratory Research"
                    class="w-full h-auto"
                    (error)="onImgError($event)"
                />
                </div>
            </div>

            <!-- Solutions -->
            <div class="order-1 lg:order-2 space-y-6">

                <div class="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full">
                Solutions
                </div>

                <h2 class="text-gray-900">
                Comprehensive Financial Modeling for Every Stage
                </h2>

                <p class="text-gray-600 text-lg">
                From early-stage research to post-market analysis, our platform provides 
                the analytical tools you need to make informed investment decisions.
                </p>

                <div class="space-y-4 pt-4">
                <div
                    class="flex items-start gap-3"
                    *ngFor="let solution of solutions; let i = index"
                >
                    <!-- Remplacer CheckCircle par un SVG simple -->
                    <svg
                    class="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    >
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12l2 2l4 -4m6 2a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z"
                    />
                    </svg>

                    <span class="text-gray-700">{{ solution }}</span>
                </div>
                </div>

            </div>

            </div>
        </div>
    </section>
  `
})
export class ImageFallback {
  @Input() solutions: string[] = [];

  // URL image (on peut aussi le passer en @Input)
  imageUrl: string =
    "/images/laboratory.jpg";

  fallbackUrl: string = '/assets/fallback.jpg';

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackUrl;
  }
}
