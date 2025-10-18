import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ProductModalComponent } from '../products/product-modal/product-modal';
import { Product } from '../../service/product';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart/cart.service';
import { AuthService } from '../../core/auth/auth.service';
import { CategoryService } from '../../service/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgFor, ProductModalComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  selectedProduct: any = null;
  showModal = false;
  searchTerm = '';
  sortOption = 'recent';
  filteredProducts: any[] = [];
  products: any[] = [];
  addedMap: Record<number, boolean> = {};
  private subs = new Subscription();

  constructor(
    private router: Router,
    private cart: CartService,
    public auth: AuthService,
    private ps: Product,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Cargar productos desde el API o fallback local
    this.subs.add(
      this.ps.listarProductos().subscribe((list: any[]) => {
        this.products = list || [];
        this.applyFilters();
      })
    );

    // Escuchar cambios de categoría
    this.subs.add(
      this.categoryService.category$.subscribe(() => {
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  addToCart(product: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    this.cart.openDrawer();
    this.addedMap[product.id] = true;
    setTimeout(() => (this.addedMap[product.id] = false), 600);
  }

  applyFilters() {
    const category = this.categoryService.currentCategory;
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter((p) => {
      // soportar p.category como string o array
      let matchesCategory = false;
      if (category === 'Todos') {
        matchesCategory = true;
      } else if (Array.isArray(p.category)) {
        matchesCategory = p.category.map((c: any) => c.toString().toLowerCase()).includes(category.toLowerCase());
      } else {
        matchesCategory = (p.category || '').toString().toLowerCase() === category.toLowerCase();
      }
      const matchesTerm =
        !term ||
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term));
      return matchesCategory && matchesTerm;
    });

    switch (this.sortOption) {
      case 'recent':
        this.filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestsellers':
        this.filteredProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSortChange(value: string) {
    this.sortOption = value;
    this.applyFilters();
  }

  openProduct(product: any) {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      this.selectedProduct = product;
      this.showModal = true;
    } else {
      this.router.navigate(['/product', product.id]);
    }
  }

  closeModal() {
    this.selectedProduct = null;
    this.showModal = false;
  }
}
