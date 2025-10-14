import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';
import { FooterComponent } from '../../../shared/footer/footer';
import { CartService } from '../../../core/cart/cart.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { PRODUCTS } from '../../..//data/products';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Navbar, FooterComponent],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private cart: CartService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.product = this.getProductById(id);
  }

  getProductById(id: string | null) {
    const pid = id ? Number(id) : null;
    const found = PRODUCTS.find(p => p.id === pid);
    return found || null;
  }

  addToCart(product: any) {
    if (!this.auth.isLoggedIn) {
      // redirige a login
      this.router.navigate(['/login']);
      return;
    }
    this.cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    // abrir drawer para mostrar que se agregó
    this.cart.openDrawer();
    console.log('Added to cart:', product);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // fallback a una imagen existente para evitar icono roto
    img.src = 'assets/img/Cardigan_de_punto_con_patrones_geometricos.png';
  }
}
