import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  readonly itemCount = input<number>();

  readonly subtotal = input<number>(0);

  readonly shipping = input<number>(0);

  readonly total = computed(() => this.subtotal() + this.shipping());

  readonly buttonText = input<string>('Pagar');

  readonly secureText = input<string>('Compra 100% segura');
}
