import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Store {
  name: string;
  logoUrl: string;
  link: string;
}

@Component({
  selector: 'app-store-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-card.component.html',
  styleUrls: ['./store-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
   host: {
    '[class]': `'block ' + spanClass()`
  }
})
export class StoreCardComponent {
  readonly store = input<Store>();

  readonly span = input<number>(1);

  // readonly spanClass = computed(() => `col-span-${Math.min(Math.max(this.span(),1),5)}`);
  readonly spanClass = computed(() => {
    const n = Math.min(Math.max(this.span(), 1), 5);
    return `col-span-${n}`;
  });
}
