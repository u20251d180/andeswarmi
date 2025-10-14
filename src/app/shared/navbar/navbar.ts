import { Component, HostListener, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';

// Observables
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnDestroy {
  sidebarOpen = false;
  userMenuOpen = false;
  cartCount = 0;
  private subs: Subscription | null = null;

  constructor(public auth: AuthService, private cart: CartService) {
    this.subs = this.cart.count$.subscribe(c => this.cartCount = c);
  }

  private updateCount() {
    const items = this.cart.getItems();
    this.cartCount = items.reduce((s, i) => s + i.qty, 0);
  }

  openCart() { this.cart.openDrawer(); }

  ngOnDestroy() {
    this.subs?.unsubscribe();
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

  // 🔹 Cierra el dropdown si haces click fuera
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }

  // 🔹 NUEVO: cierra el sidebar al pasar a modo escritorio
  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth > 1023 && this.sidebarOpen) {
      this.sidebarOpen = false;
      document.body.classList.remove('sidebar-open');
    }
  }
}
