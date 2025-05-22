import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { GetMarcasVehiculosRes, GetProductosOfertaRes, GetProductosUltRes, GetSearchAutopartesRes, GetSubCategoriesRes } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.externalAuth.apiUrl}}`; // Replace with your actual API URL
  constructor() { }


  getSubsubcategorias(){
    return this.http.get<GetSubCategoriesRes[]>(`${this.apiUrl}/getSubsubcategorias/`)
  }

  getProductosOfertas(){
    return this.http.get<GetProductosOfertaRes[]>(`${this.apiUrl}/getProductosOferta/`)
  }

  getProductosUltimaVisita(){
    return this.http.get<GetProductosUltRes[]>(`${this.apiUrl}/getProductosUltimaVisita/`)
  }

  searchAutoparteV3(
    search: string,
    limit: number,
    page: number,
    categoriaSeleccionada: string | undefined,
    marcasSeleccionadas: string,
    vehiculo: string
  ) {
    // Construye los query params
    let params = new HttpParams()
      .set('search', search)
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('categoriaSeleccionada', categoriaSeleccionada ?? 'undefined')
      .set('marcasSeleccionadas', marcasSeleccionadas)
      .set('vehiculo', vehiculo);

    return this.http.get<GetSearchAutopartesRes>(
      `${this.apiUrl}/searchAutoparteV3/`,
      { params }
    );
  }
  
  getAniosVehiculos(){
    return this.http.get<any[]>(`${this.apiUrl}/getAniosVehiculos/`)
  }

  getMarcasVehiculos(){
    return this.http.get<GetMarcasVehiculosRes[]>(`${this.apiUrl}/getMarcasVehiculos/`)
  }

}
