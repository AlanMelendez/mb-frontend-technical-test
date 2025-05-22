import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Product {
  sku: string;
  imageUrl: string;
  title: string;
  rating: number;
  originalPrice: number;
  price: number;
  selected?: boolean;
}

@Component({
  selector: 'app-bought-together',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bought-together.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoughtTogetherComponent {
  readonly products = input<Product[]>([
    {
      sku: 'DCAT019939',
      title: 'Radiador agrícola tractor Carter 580 k Aluminio/Aluminio TM',
      imageUrl: '/assets/products/rectangle.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019940',
      title: 'Aspas para ventilador Mazda B2000, B22000',
      imageUrl: '/assets/products/r2.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019941',
      title: 'Escape resonador mofi',
      imageUrl: '/assets/products/r3.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
  ]);

  readonly totalPrice = computed(() =>
    this.products()!
      .filter(p => p.selected ?? true)
      .reduce((sum, p) => sum + p.price, 0)
  );

  /** Handler para checkbox */
  toggleSelect(index: number) {
    const arr = [...this.products()!];
    arr[index] = { ...arr[index], selected: !arr[index].selected };
    (this.products as unknown as any).set(arr);
  }

   products2: Product[] = [
    {
      sku: 'DCAT019939',
      title: 'Radiador agrícola tractor Carter 580 k Aluminio/Aluminio TM',
      imageUrl: '/assets/products/rectangle.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019940',
      title: 'Aspas para ventilador Mazda B2000, B22000',
      imageUrl: '/assets/products/r2.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019941',
      title: 'Escape resonador mofi',
      imageUrl: '/assets/products/r3.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019942',
      title: 'Carter aceite Mazda 6 2.5, 20009 a 2010 aluminio',
      imageUrl: '/assets/products/r4.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019943',
      title: 'Kit 5 Bujías NGK Platino VW Jetta Mk6 Bora Beetle Motor 2.5l',
      imageUrl: '/assets/products/r5.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
  ];
}
