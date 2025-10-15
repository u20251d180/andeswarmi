import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/cart/cart.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PRODUCTS } from '../../../data/products';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})


export class ProductDetail implements OnInit {
  product: any;
  isAdded = false;
  relatedProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    public auth: AuthService
  ) {}
  

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = PRODUCTS.find(p => p.id === id);
    this.relatedProducts = PRODUCTS.filter(p => p.id !== id).slice(0, 4);
  }

  addToCart(product: any) {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    this.cart.openDrawer();
    this.isAdded = true;
    setTimeout(() => this.isAdded = false, 600);
  }

  goToProduct(id: number) {
    this.router.navigate(['/product', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/default-placeholder.png';
  }
  @ViewChild('slider') sliderRef!: ElementRef<HTMLDivElement>;

scrollSlider(direction: 'left' | 'right') {
  const slider = this.sliderRef.nativeElement;
  const scrollAmount = 250; // distancia por click
  slider.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
}
}
