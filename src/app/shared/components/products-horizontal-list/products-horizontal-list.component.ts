import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface Product {
  sku: string;
  title: string;
  imageUrl: string;
  rating: number;
  originalPrice: number;
  price: number;
}
@Component({
  selector: 'app-products-horizontal-list',
  imports: [CommonModule],
  templateUrl: './products-horizontal-list.component.html',
  styleUrl: './products-horizontal-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsHorizontalListComponent { 

  titulo = input<string>('Ejemplo de Titulo');
  mostrar = input<boolean>(true);
  products: Product[] = [
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
