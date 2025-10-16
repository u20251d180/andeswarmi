import { Component, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AwUser } from '../../core/auth/auth.service';
import { CartService } from '../../core/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  sidebarOpen = false;
  userMenuOpen = false;
  cartCount = 0;
  user: AwUser | null = null;

  private subs = new Subscription();

  constructor(
    public auth: AuthService,
    private cart: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Escuchar usuario logueado
    this.subs.add(
      this.auth.user$.subscribe(u => {
        this.user = u;
        console.log('Usuario actualizado →', u);
        this.cdr.detectChanges();
      })
    );

    // Escuchar carrito
    this.subs.add(this.cart.count$.subscribe(c => this.cartCount = c));
  }

  openCart() { this.cart.openDrawer(); }

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
