import { Component } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { ProductModalComponent } from '../products/product-modal/product-modal';
import { PRODUCTS } from '../../data/products';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart/cart.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgFor, ProductModalComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  selectedProduct: any = null;

  showModal: boolean = false;

  searchTerm: string = '';
  // opciones de ordenamiento: 'recent' | 'bestsellers' | 'price-asc' | 'price-desc'
  sortOption: string = 'recent';
  filteredProducts: any[] = [];

  products: any[] = PRODUCTS;
  
  constructor(private router: Router, private cart: CartService, public auth: AuthService) {
    // Inicializar lista filtrada
    this.filteredProducts = [...this.products];
    // Aplicar orden inicial
    this.applyFilters();
  }

  addToCart(product: any, event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cart.addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    this.cart.openDrawer();
  }

  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.products.filter(p => {
      const matchesTerm = !term || (p.name && p.name.toLowerCase().includes(term)) || (p.description && p.description.toLowerCase().includes(term));
      return matchesTerm;
    });

    // Ordenar según sortOption
    switch(this.sortOption){
      case 'recent':
        this.filteredProducts.sort((a,b) => (new Date(b.createdAt).getTime()) - (new Date(a.createdAt).getTime()));
        break;
      case 'bestsellers':
        this.filteredProducts.sort((a,b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a,b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        // Priorizar exclusivos y luego precio descendente
        this.filteredProducts.sort((a,b) => {
          const exA = a.exclusive ? 1 : 0; const exB = b.exclusive ? 1 : 0;
          if (exB !== exA) return exB - exA;
          return (b.price || 0) - (a.price || 0);
        });
        break;
    }
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSortChange(value: string){
    this.sortOption = value;
    this.applyFilters();
  }
 

openModal(product: any, event?: MouseEvent) {
  if (event) event.stopPropagation();
  // Asignar en el siguiente tick para evitar que el mismo click cierre el overlay
  setTimeout(() => {
    this.selectedProduct = product;
  }, 120);
}


  openProduct(product: any) {
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop) {
      // 🖥️ Desktop: abre modal
      this.selectedProduct = product;
      this.showModal = true;
    } else {
      // 📱 Mobile: redirige a ProductDetail
      this.showModal = false;
      this.router.navigate(['/product', product.id]);
    }
  }


  closeModal() {
    this.selectedProduct = null;
    this.showModal = false;
  }
  
}
