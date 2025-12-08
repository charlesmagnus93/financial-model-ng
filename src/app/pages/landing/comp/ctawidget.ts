import { Component } from "@angular/core";
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'cta-widget',
    standalone: true,
    imports: [LucideAngularModule, ButtonModule],
    template: `
        <section class="py-20 lg:py-28 bg-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div
                class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800"
                >
                <!-- Background Image -->
                <div class="absolute inset-0 opacity-10">
                    <img
                    src="https://images.unsplash.com/photo-1706777280252-5de52771cf13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzY1MTA4ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    class="w-full h-full object-cover"
                    alt="Medical Technology"
                    (error)="onImageError($event)"
                    />
                </div>

                <!-- Content -->
                <div class="relative px-8 py-16 lg:px-16 lg:py-24 text-center">
                    <h2 class="text-white mb-6">
                    Ready to Transform Your Pharmaceutical Financial Modeling?
                    </h2>

                    <p class="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                    Join hundreds of pharmaceutical companies using PharmaFinance to make better,
                    data-driven investment decisions. Start your free 30-day trial today.
                    </p>

                    <!-- Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    
                    <!-- Primary CTA -->
                    <p-button
                        class="group inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-600 hover:bg-blue-50 text-lg font-medium transition"
                    >
                        Start Free Trial
                        <lucide-icon
                        [img]="ArrowRight"
                        class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        ></lucide-icon>
                    </p-button>

                    <!-- Secondary CTA -->
                    <p-button
                        class="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white text-white hover:bg-white/10 text-lg font-medium transition"
                    >
                        Schedule Demo
                    </p-button>
                    </div>

                    <p class="text-blue-200 mt-6">
                    No credit card required • 30-day free trial • Cancel anytime
                    </p>
                </div>
                </div>

            </div>
        </section>
    `
})
export class CTAWidget {
    ArrowRight = ArrowRight;

  fallbackImage =
    'https://via.placeholder.com/1600x900.png?text=Background+Unavailable';

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }
}