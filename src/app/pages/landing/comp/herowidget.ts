import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ImageFallback } from "./imageFallbackwidget";


@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [RouterModule, ButtonModule, ImageFallback],
    template: `
        <section class="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Left Content -->
            <div class="space-y-8">
                <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                <span class="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span>Advanced Financial Modeling Platform</span>
                </div>

                <h1 class="text-gray-900">
                Transform Pharmaceutical Financial Planning with AI-Powered Analytics
                </h1>

                <p class="text-gray-600 text-lg">
                A comprehensive implementation of pharmaceutical financial models that translates 
                complex assumptions into reproducible analytical engines and interactive dashboards. 
                Make data-driven decisions with confidence.
                </p>

                <div class="flex flex-col sm:flex-row gap-4">
                <!-- <Button size="lg" class="group">
                    Get Started Free
                    <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" class="group">
                    <Play class="mr-2 h-4 w-4" />
                    Watch Demo
                </Button> -->
                </div>

                <div class="flex items-center gap-8 pt-4">
                <div>
                    <div class="text-gray-900">500+</div>
                    <div class="text-gray-600">Pharma Companies</div>
                </div>
                <div class="h-12 w-px bg-gray-300"></div>
                <div>
                    <div class="text-gray-900">$2.5B+</div>
                    <div class="text-gray-600">Analyzed Capital</div>
                </div>
                <div class="h-12 w-px bg-gray-300"></div>
                <div>
                    <div class="text-gray-900">98%</div>
                    <div class="text-gray-600">Accuracy Rate</div>
                </div>
                </div>
            </div>

            <!-- Right Content - Dashboard Preview  -->
            <div class="relative">
                <div class="absolute -top-4 -right-4 h-72 w-72 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                <div class="absolute -bottom-4 -left-4 h-72 w-72 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
                <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <image-fallback
                    src="/images/financial-dashboard.jpg"
                    alt="Financial Analytics Dashboard"
                    class="w-full h-auto"
                />
                </div>
            </div>
            </div>
        </div>
        </section>
    `
})
export class HeroWidget {
    constructor(public router: Router) {}
}