import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  standalone: true,
  selector: 'btn-plus-min',
  imports: [
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputNumberModule,
    InputGroupAddonModule,
  ],
  template: `
    <!-- <div class="mt-1">
      <div class="font-semibold text-sm">{{ title }}</div>
      <p-inputgroup>
        <p-inputgroup-addon>
          <p-button label="&nbsp;-&nbsp;" (click)="sub()"/>
        </p-inputgroup-addon>
        <p-inputnumber step="{{step}}" label="Ici" placeholder="" [(ngModel)]="value" />
        <p-inputgroup-addon>
          <p-button label="&nbsp;+&nbsp;" (click)="add()"/>
        </p-inputgroup-addon>
      </p-inputgroup>
    </div> -->
  <!--  -->
  <div class="mt-1">
    <div class="font-semibold text-sm">{{ title }}</div>
      <p-inputgroup>
        <input
          type="number"
          class="p-inputnumber p-component p-inputtext w-24 text-center"
          [step]="step"
        />
      </p-inputgroup>
    </div>
  `,
})
export class BtnPlusMin {
  @Input() title: string = '';
  @Input() step: number = 1;

  value: number = 0;

  add() {
    this.value += this.step;
  }

  sub() {
    this.value -= this.step;
  }
}
