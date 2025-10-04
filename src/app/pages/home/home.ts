import { Component } from '@angular/core';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { ProductModalComponent } from '../../shared/product-modal/product-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, Navbar, NgOptimizedImage, ProductModalComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  selectedProduct: any = null;

  searchTerm: string = '';
  // opciones de ordenamiento: 'recent' | 'bestsellers' | 'price-asc' | 'price-desc'
  sortOption: string = 'recent';
  filteredProducts: any[] = [];

  products: any[] = [
    {
      name: 'Cardigan de lana Creamy',
      price: 89.90,
      image: 'assets/img/cardigan-de-lana-de-alpaca.png',
      images: [
        'assets/img/cardigan-de-lana-de-alpaca.png',
        'assets/img/cardigan-image2.png'
      ],
      description: 'Cardigan tejido a mano con lana andina 100% natural.',
      sold: 48,
      exclusive: false,
      createdAt: '2025-09-10T10:00:00Z'
    },
    {
      name: 'Gorro de Alpaca',
      price: 69.90,
      image: 'assets/img/gorro-de-alpaca-FairIsle.png',
      images: [
        'assets/img/gorro-de-alpaca-FairIsle.png',
        'assets/img/gorro-image2.png'
      ],
      description: 'Gorro abrigador hecho con lana de alpaca peruana.',
      sold: 120,
      exclusive: false,
      createdAt: '2025-09-20T11:30:00Z'
    },
    {
      name: 'Poncho Andino',
      price: 129.90,
      image: 'assets/img/poncho-andino-tradicional.png',
      images: ['assets/img/poncho-andino-tradicional.png'],
      description: 'Poncho tradicional con diseño andino.',
      sold: 15,
      exclusive: true,
      createdAt: '2025-08-02T09:00:00Z'
    },
    {
      name: 'Poncho Alpaca Taupe',
      price: 79.90,
      image: 'assets/img/poncho-de-alpaca-taupe.png',
      images: ['assets/img/poncho-de-alpaca-taupe.png'],
      description: 'Poncho de alpaca en color taupe, elegante y cálido.',
      sold: 30,
      exclusive: false,
      createdAt: '2025-07-15T08:00:00Z'
    },
    {
      name: 'Cardigan',
      price: 79.90,
      image: 'assets/img/sueter-tradicional-mostaza.png',
      images: ['assets/img/sueter-tradicional-mostaza.png'],
      description: 'Cardigan tradicional color mostaza, cómodo y moderno.',
      sold: 5,
      exclusive: true,
      createdAt: '2025-09-25T14:00:00Z'
    }
  ];
  
  constructor(){
    // Inicializar lista filtrada
    this.filteredProducts = [...this.products];
    // Aplicar orden inicial
    this.applyFilters();
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

  closeModal() {
    this.selectedProduct = null;
  }
}
