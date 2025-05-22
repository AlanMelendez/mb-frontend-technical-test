import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { BoughtTogetherComponent } from "../bought-together/bought-together.component";
import { SummaryCardComponent } from "../summary-card/summary-card.component";

export interface CartItem {
  sku: string;
  imageUrl: string;
  title: string;
  quantity: number;
  available: number;
  price: number;
  shippingCost: number;
}

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent, HeaderComponent, BoughtTogetherComponent, SummaryCardComponent],
  templateUrl: './carrito-compras.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoComprasComponent {
  @Input() items = signal<CartItem[]>([
  {
    sku: 'VEMO12345',
    imageUrl: '/assets/products/r2.png',
    title: 'VEMO Bujía de encendido Q+, calidad de primer equipo',
    quantity: 1,
    available: 10,
    price: 250.00,
    shippingCost: 0
  },
  {
    sku: 'NGK67890',
    imageUrl: '/assets/products/r3.png',
    title: 'NGK Iridium IX Bujía de alta performance',
    quantity: 2,
    available: 5,
    price: 320.00,
    shippingCost: 0
  },
  {
    sku: 'BOSCH11223',
    imageUrl: '/assets/products/r4.png',
    title: 'Bosch Super 4 Bujía doble electrodo',
    quantity: 1,
    available: 8,
    price: 285.50,
    shippingCost: 15.00
  },
  {
    sku: 'DENSO44556',
    imageUrl: '/assets/products/r5.png',
    title: 'Denso Bujía Platinum TT',
    quantity: 3,
    available: 12,
    price: 299.99,
    shippingCost: 20.00
  }]
);

  readonly subtotal = computed(() =>
    this.items().reduce((sum, it) => sum + it.price * it.quantity, 0)
  );
  readonly shipping = computed(() =>
    this.items().reduce((sum, it) => sum + (it.shippingCost || 0), 0)
  );
  readonly total = computed(() => this.subtotal() + this.shipping());
}
