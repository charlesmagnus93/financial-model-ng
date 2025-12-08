import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'testimonial-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-20 lg:py-28 bg-gradient-to-br from-blue-600 to-purple-700">
  
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <!-- Header -->
            <div class="text-center max-w-3xl mx-auto mb-16">
            <div class="inline-block bg-white/20 text-white px-4 py-2 rounded-full mb-4">
                Testimonials
            </div>

            <h2 class="text-white mb-4">
                Trusted by Leading Pharmaceutical Companies
            </h2>

            <p class="text-blue-100 text-lg">
                See what industry leaders are saying about our platform
            </p>
            </div>

            <!-- Testimonials Grid -->
            <div class="grid md:grid-cols-3 gap-8">
            <div
                *ngFor="let testimonial of testimonials"
                class="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-colors"
            >
                <!-- Quote Icon -->
                <div class="mb-6">
                <svg
                    class="h-8 w-8 text-blue-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                    />
                </svg>
                </div>

                <!-- Quote -->
                <p class="text-white mb-6">
                {{ testimonial.quote }}
                </p>

                <!-- Author Info -->
                <div class="border-t border-white/20 pt-6">
                <div class="text-white">{{ testimonial.author }}</div>
                <div class="text-blue-200">{{ testimonial.role }}</div>
                <div class="text-blue-300">{{ testimonial.company }}</div>
                </div>
            </div>
            </div>

        </div>
    </section>
    `
    })
export class TestimonialWidget {
    testimonials = [
    {
      quote:
        'PharmaFinance transformed how we evaluate our drug pipeline. The scenario analysis capabilities saved us millions in potential misallocated resources.',
      author: 'Dr. Sarah Chen',
      role: 'Chief Financial Officer',
      company: 'BioPharma Innovations',
    },
    {
      quote:
        'The reproducible analytical engine gives us confidence in our projections. We can now present to investors with data-backed precision.',
      author: 'Michael Rodriguez',
      role: 'VP of Strategic Planning',
      company: 'MedTech Solutions',
    },
    {
      quote:
        'Implementation was seamless, and the ROI was immediate. Our financial modeling efficiency improved by 85% in the first quarter.',
      author: 'Dr. Emily Watson',
      role: 'Director of R&D Finance',
      company: 'Global Pharma Corp',
    },
  ];
}