import { Component, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AwUser } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  sidebarOpen = false;
  userMenuOpen = false;
  cartCount = 0;
  user: AwUser | null = null;

  // Categorías del catálogo
  categories = ['Todos', 'Mujeres', 'Hombres', 'Ponchos', 'Cardigans', 'Otros'];
  activeCategory = 'Todos';

  private subs = new Subscription();

  constructor(
    public auth: AuthService,
    private cart: CartService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    // Escuchar usuario logueado
    this.subs.add(this.auth.user$.subscribe((u) => {
      this.user = u;
      this.cdr.detectChanges();
    }));

    // Escuchar carrito
    this.subs.add(this.cart.count$.subscribe(c => this.cartCount = c));

    // Escuchar cambios de categoría
    this.subs.add(
      this.categoryService.category$.subscribe((category) => {
        this.activeCategory = category;
        this.cdr.markForCheck();
      })
    );
  }

  selectCategory(category: string) {
    this.categoryService.setCategory(category);
  }

  openCart() {
    this.cart.openDrawer();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    document.body.classList.toggle('sidebar-open', this.sidebarOpen);
  }

  logout() {
    this.auth.logout();
    this.toggleSidebar();
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) this.userMenuOpen = false;
  }

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth > 1023 && this.sidebarOpen) {
      this.sidebarOpen = false;
      document.body.classList.remove('sidebar-open');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
