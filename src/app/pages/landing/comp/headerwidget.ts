import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";


@Component({
    selector: 'header-widget',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
    <div class="bg-surface-0 dark:bg-surface-900">
            <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
            <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                 <!-- Logo  -->
                <div class="flex items-center">
                    <a [routerLink]="'/dashboard'" class="flex items-center gap-2">
                    <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white">Fm</span>
                    </div>
                    <span class="text-gray-900">Financials Models</span>
                    </a>
                </div>

                 <!-- Desktop Navigation  -->
                <!-- <div class="hidden md:flex md:items-center md:gap-8">
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
                </div> -->

                <!-- CTA Buttons  -->
                <div class="hidden md:flex md:items-center md:gap-4">
                    <p-button type="button" (click)="goTo()">Sign In</p-button>
                    <!-- <p-button type="button">Request Demo</p-button> -->
                </div>
                </div>
            </nav>
        </header>
    `
})

export class HeaderWidget {
    constructor(public router: Router) {}

    goTo() {
        this.router.navigate(['/login']);
    }
}