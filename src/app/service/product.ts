import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Product {
  constructor(private http: HttpClient) { }

  listarProductos () {
    return this.http.get('/api/productos', {responseType: 'json'});
  }
  
  obtenerproducto (id: any) {
    return this.http.get('/api/producto/' + id, {responseType: 'json'});
  }

}
