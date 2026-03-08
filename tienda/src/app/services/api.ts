import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ServicesApi {
  // URL de la API
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de productos desde la API
   * Retorna un Observable de Product[]
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(this.apiUrl).pipe(
      map(response => response.products) // extrae solo el array de productos
    );
  }
}