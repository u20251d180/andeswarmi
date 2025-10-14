import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../core/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="cart-drawer" [class.open]="open">
    <div class="cart-header">
      <h3>Carrito</h3>
      <button class="close" (click)="close()">×</button>
    </div>
    <div class="cart-body">
      <div *ngIf="items.length === 0" class="empty">Tu carrito está vacío</div>
      <div *ngFor="let it of items" class="cart-item">
        <img [src]="it.image || '/assets/icons/icon_shopping_cart.svg'" alt=""/>
        <div class="info">
          <div class="name">{{it.name}}</div>
          <div class="meta">{{it.qty}} × S/{{it.price}}</div>
        </div>
        <button class="remove" (click)="remove(it.id)">×</button>
      </div>
    </div>
    <div class="cart-footer">
      <div class="total">Total: <strong>S/{{total | number:'1.2-2'}}</strong></div>
      <button class="checkout" [disabled]="items.length===0" (click)="checkout()">Pagar</button>
    </div>
  </div>
  <div class="cart-backdrop" *ngIf="open" (click)="close()"></div>
  `,
  styles: [
    `.cart-drawer{position:fixed;right:-360px;top:0;height:100vh;width:360px;background:#fff;box-shadow:-8px 0 24px rgba(0,0,0,.12);z-index:1200;transition:right .25s ease;padding:12px;display:flex;flex-direction:column}
     .cart-drawer.open{right:0}
     .cart-header{display:flex;align-items:center;justify-content:space-between;padding:8px 4px}
     .cart-body{flex:1;overflow:auto;padding:8px}
     .cart-item{display:flex;align-items:center;gap:8px;padding:8px 4px;border-bottom:1px solid #eee}
     .cart-item img{width:64px;height:64px;object-fit:cover;border-radius:6px}
     .cart-item .info{flex:1}
     .cart-item .remove{background:transparent;border:0;font-size:20px}
     .cart-footer{padding:12px;border-top:1px solid #eee;display:flex;align-items:center;justify-content:space-between}
     .cart-backdrop{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:1100}
  `]
})
export class CartDrawer {
  open = false;
  items: CartItem[] = [];
  total = 0;
  private subs: Subscription | null = null;

  constructor(private cart: CartService) {
    this.reload();
      this.subs = new Subscription();
      this.subs.add(this.cart.drawerOpen$.subscribe(v => {
        this.open = v;
      }));
      this.subs.add(this.cart.items$.subscribe(it => {
        this.items = it;
        this.total = this.cart.getTotal();
      }));
  }

  openDrawer() { this.open = true; this.reload(); }
  close() { this.open = false; }

  reload() {
    this.items = this.cart.getItems();
    this.total = this.cart.getTotal();
  }

  remove(id: number) {
    this.cart.removeItem(id);
    this.reload();
  }

  checkout() {
    const order = this.cart.checkout();
    // after checkout, refresh local state and optionally navigate
    this.reload();
    this.close();
    console.log('Order created', order);
  }
  
  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
