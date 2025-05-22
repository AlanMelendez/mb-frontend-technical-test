import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductsHorizontalListComponent } from "../../shared/components/products-horizontal-list/products-horizontal-list.component";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { CategoriesHorizontalListComponent } from "../../shared/components/categories-horizontal-list/categories-horizontal-list.component";
interface Product {
  sku: string;
  title: string;
  imageUrl: string;
  rating: number;
  originalPrice: number;
  price: number;
}
@Component({
  selector: 'app-dashboard',
  imports: [ProductsHorizontalListComponent, HeaderComponent, FooterComponent, CategoriesHorizontalListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent { 
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

  categorias: any[] = [
  { name: 'Llantas', imageUrl: '/assets/products/rectangle.png', link: '/categorias/llantas' },
  { name: 'Frenos', imageUrl: '/assets/products/rectangle.png', link: '/categorias/frenos' },
  { name: 'Rines',  imageUrl: '/assets/products/rectangle.png',  link: '/categorias/rines' },
  { name: 'Baterías', imageUrl: '/assets/products/rectangle.png', link: '/categorias/baterias' },
  { name: 'Asientos', imageUrl: '/assets/products/rectangle.png', link: '/categorias/asientos' },

]

}
