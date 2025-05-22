import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Category {
  name: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-categories-horizontal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-horizontal-list.component.html',
  styleUrls: ['./categories-horizontal-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesHorizontalListComponent {
  /** Section heading */
  readonly titulo = input<string>();

  /** How many categories to show */
  readonly numeroElementos = input<number>();

  /** The list of categories */
  readonly listadoCategorias = input<Category[]>();

  /** Slice out only the first N categories */
  readonly categoriasAMostrar = computed(() =>
    this.listadoCategorias()!.slice(0, this.numeroElementos())
  );
}
