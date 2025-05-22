import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {  input as signalInput } from '@angular/core'; 
import { Product, ProductsHorizontalListComponent } from '../products-horizontal-list/products-horizontal-list.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { StoreCardComponent } from "../store-card/store-card.component";


interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductsHorizontalListComponent,
    HeaderComponent,
    FooterComponent,
    StoreCardComponent
],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  readonly title = signal('Bujía Mazda 3 de 2015');
  readonly breadcrumb = signal(['Motor', 'bujías']);

  readonly totalCount = signal(680_896);

  public fb = inject(FormBuilder);

  readonly filtersForm = this.fb.group({
    entregaManana: [false],
    envioGratis:    [false],
    tiendasOficiales: [false],
    marcasOpen:    [false],
    marcas:        this.fb.group({
      Autolite: [false],
      Bosch:    [false],
      Champion: [false],
      Denso:    [false],
      NGK:      [false],
    }),
  });

  readonly sortOptions: FilterOption[] = [
    { label: 'Menor precio', value: 'priceAsc' },
    { label: 'Mayor precio', value: 'priceDesc' },
    { label: 'Más populares', value: 'popularity' },
  ];
  readonly sortControl = this.fb.control(this.sortOptions[0].value);
  readonly isGridView = signal(true);

// readonly listadoProductos = input<Product[]>();

readonly listadoProductos: any[] = [
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
    {
      sku: 'DCAT019944',
      title: 'Bujía de encendido NGK Iridium IX',
      imageUrl: '/assets/products/r5.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019945',
      title: 'Bujía de encendido Denso Platinum TT',
      imageUrl: '/assets/products/r7.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
    {
      sku: 'DCAT019946',
      title: 'Bujía de encendido Bosch Super Plus',
      imageUrl: '/assets/products/r8.png',
      rating: 4.9,
      originalPrice: 1842,
      price: 1842,
    },
  ];

  tienda =     { name: 'Tienda 5', logoUrl: '/assets/stores/6.png', link: '/tienda/5' };

  readonly productosAMostrar = computed(
    () => {
   
        // return this.listadoProductos()!;
        return this.listadoProductos;
      
    }
  );
  readonly pagedProducts = computed(() =>
    this.productosAMostrar().slice(0, 10) // e.g. first 10
  );

  entregaMananaControl(control:any): FormControl<boolean> {
    return this.filtersForm.get(control) as FormControl<boolean>;
  }

}
