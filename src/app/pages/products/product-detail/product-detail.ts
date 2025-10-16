import { Component, OnInit, OnDestroy } from '@angular/core';
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


export class ProductDetail implements OnInit, OnDestroy {
  product: any;
  isAdded = false;
  relatedProducts: any[] = [];
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    public auth: AuthService
  ) {}
  

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadProduct(id);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe?.();
  }

  private loadProduct(id: number) {
    this.product = PRODUCTS.find(p => p.id === id) || null;
    this.relatedProducts = PRODUCTS.filter(p => p.id !== id).slice(0, 4);
    // scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // navegar a la misma ruta con otro id -> la suscripción recargará el producto
    this.router.navigate(['/product', id]);
  }

  backToHome() {
    this.router.navigate(['/']);
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
