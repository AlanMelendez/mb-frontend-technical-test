import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SummaryCardComponent, FooterComponent, HeaderComponent],
  templateUrl: './checkout-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent {
  @Input() itemCount = signal(4);
  @Input() subtotal = signal(1000);
  @Input() shipping = signal(250);

  fb = inject(FormBuilder);

 checkoutForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  phone: ['', Validators.required],
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  street: ['', Validators.required],
  extNumber: ['', Validators.required],
  intNumber: [''],
  colony: ['', Validators.required],
  postalCode: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required],
});


}
