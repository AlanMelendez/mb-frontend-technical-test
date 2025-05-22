import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Store {
  name: string;
  logoUrl: string;
  link: string;
}

@Component({
  selector: 'app-stores-horizontal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stores-horizontal-list.component.html',
  styleUrls: ['./stores-horizontal-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresHorizontalListComponent {
  readonly titulo = input<string>('Tiendas Oficiales');
  readonly listadoTiendas = input<Store[]>();

  readonly tiendasTop = computed(() =>
    this.listadoTiendas()!.slice(0, 5)
  );

  /** The 6th store */
  readonly tiendaFeatured = computed(() =>
    this.listadoTiendas()![5]
  );
}
