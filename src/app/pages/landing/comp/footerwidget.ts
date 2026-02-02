import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Linkedin, Twitter, Youtube, Mail, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'footer-widget',
    standalone: true,
    imports: [LucideAngularModule, CommonModule],
    template: `
    <footer class="bg-gray-900 text-gray-300 py-12"><footer class="bg-gray-900 text-gray-300">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

            <div class="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

            <!-- Brand Column -->
            <div class="lg:col-span-2">
                <div class="flex items-center gap-2 mb-4">
                <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span class="text-white">NQ</span>
                </div>
                <span class="text-white">NumQuants</span>
                </div>

                <p class="text-gray-400 mb-6">
                Advanced pharmaceutical financial modeling platform delivering reproducible
                analytics and interactive dashboards for data-driven decisions.
                </p>

                <div class="flex gap-4">
                <a
                    href="#"
                    class="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <lucide-icon [img]="Linkedin" class="h-5 w-5"></lucide-icon>
                </a>

                <a
                    href="#"
                    class="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <lucide-icon [img]="Twitter" class="h-5 w-5"></lucide-icon>
                </a>

                <a
                    href="#"
                    class="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <lucide-icon [img]="Youtube" class="h-5 w-5"></lucide-icon>
                </a>

                <a
                    href="#"
                    class="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                    <lucide-icon [img]="Mail" class="h-5 w-5"></lucide-icon>
                </a>
                </div>
            </div>

            <!-- Product Links -->
            <div>
                <h3 class="text-white mb-4">Product</h3>
                <ul class="space-y-3">
                <li *ngFor="let link of footerLinks.product">
                    <a href="{{ link.href }}" class="hover:text-white transition-colors">
                    {{ link.label }}
                    </a>
                </li>
                </ul>
            </div>

            <!-- Company Links -->
            <div>
                <h3 class="text-white mb-4">Company</h3>
                <ul class="space-y-3">
                <li *ngFor="let link of footerLinks.company">
                    <a href="{{ link.href }}" class="hover:text-white transition-colors">
                    {{ link.label }}
                    </a>
                </li>
                </ul>
            </div>

            <!-- Resources Links -->
            <div>
                <h3 class="text-white mb-4">Resources</h3>
                <ul class="space-y-3">
                <li *ngFor="let link of footerLinks.resources">
                    <a href="{{ link.href }}" class="hover:text-white transition-colors">
                    {{ link.label }}
                    </a>
                </li>
                </ul>
            </div>

            <!-- Legal Links -->
            <div>
                <h3 class="text-white mb-4">Legal</h3>
                <ul class="space-y-3">
                <li *ngFor="let link of footerLinks.legal">
                    <a href="{{ link.href }}" class="hover:text-white transition-colors">
                    {{ link.label }}
                    </a>
                </li>
                </ul>
            </div>

            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-gray-800 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-gray-400">
                &copy; 2026 NumQuants. All rights reserved.
                </p>
                <p class="text-gray-400">
                Empowering pharmaceutical innovation through intelligent financial modeling
                </p>
            </div>
            </div>

        </div>
    </footer>
`
    })

export class FooterWidget {  Linkedin = Linkedin;
  Twitter = Twitter;
  Youtube = Youtube;
  Mail = Mail;

  footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'Analytics', href: '#analytics' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press', href: '#press' },
      { label: 'Partners', href: '#partners' },
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Case Studies', href: '#cases' },
      { label: 'Webinars', href: '#webinars' },
      { label: 'Support', href: '#support' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' },
      { label: 'Compliance', href: '#compliance' },
    ],
  };
}