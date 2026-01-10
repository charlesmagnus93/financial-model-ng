import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterModule],
    template: `<div class="layout-footer">
        © 2025, 
        <a [routerLink]="'/dashboard'" class="text-primary font-bold hover:underline">NumQuants</a>
    </div>`
})
export class AppFooter {}
