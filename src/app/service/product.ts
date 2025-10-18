import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PRODUCTS } from '../data/products';

@Injectable({
  providedIn: 'root'
})
export class Product {
  // API Gateway base URL que devuelve { data: [...] }
  private readonly apiUrl = 'https://pjq6h9odc7.execute-api.us-east-1.amazonaws.com/v1/producto';

  constructor(private http: HttpClient) { }

  /**
   * Lista productos desde el API. Si falla, devuelve el arreglo local `PRODUCTS`.
   */
  listarProductos(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const list = res && res.data ? res.data : [];
        return list.map((item: any) => ({
          id: item.idProducto ?? item.id ?? null,
          name: item.nombre ?? item.name ?? '',
          price: item.precio ?? item.price ?? 0,
          description: item.descripcion ?? item.description ?? '',
          image: (item.imagenes && item.imagenes.length) ? item.imagenes[0].ruta : (item.image || null),
          images: item.imagenes ? item.imagenes.map((i: any) => i.ruta) : (item.images || []),
          sold: item.sold ?? 0,
          exclusive: item.exclusive ?? false,
          createdAt: item.createdAt ?? null
          
        }));
     
      }),
      catchError(err => {
        // Fallback: devolver PRODUCTS definidos localmente
        console.warn('listarProductos: fallo el API, usando PRODUCTS local como fallback', err && err.message ? err.message : err);
        return of(PRODUCTS);
      })
    );
  }

  /**
   * Obtener un producto por id. Busca en el API y mapea al formato de la app.
   * Si no existe un endpoint por id, realiza la consulta completa y filtra.
   */
  obtenerproducto(id: any): Observable<any | null> {
    // Intentamos obtener la lista y filtrar por id
    return this.listarProductos().pipe(
      map(list => {
        const found = list.find((p: any) => p.id == id || p.idProducto == id);
        return found || null;
      }),
      catchError(err => {
        console.warn('obtenerproducto: error al obtener producto', err && err.message ? err.message : err);
        return of(null);
      })
    );
  }

}
