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
      <img src="assets/icons/arrow.svg" alt="arrow" (click)="close()" style="cursor:pointer; width:24px; height:24px;">
      <div>
        <h3 >Carrito</h3>

      </div>
    </div>
    <div class="cart-body">
      <div *ngIf="items.length === 0" class="empty">Tu carrito está vacío</div>
      <div *ngFor="let it of items" class="cart-item">
        <img [src]="it.image || '/assets/icons/icon_shopping_cart.svg'" alt=""/>
        <div class="info">
          <div class="name">{{it.name}}</div>
      <div class="meta">S/{{ it.price | number:'1.2-2' }}</div>

      <div class="qty-controls">
      <button (click)="decrease(it)">−</button>
      <span>{{ it.qty }}</span>
      <button (click)="increase(it)">+</button>
    </div>
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
 styles: [`
  .cart-drawer {
    position: fixed;
    right: -360px;
    top: 0;
    height: 100vh;
    width: 360px;
    background: #fff;
    box-shadow: -8px 0 24px rgba(0,0,0,.12);
    z-index: 1200;
    transition: right .25s ease;
    display: flex;
    flex-direction: column;
  }

  .cart-drawer.open { right: 0; }

  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    color: #523B2B;
    border-bottom: 1px solid #eee;
  }
  .cart-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  color: #523B2B;
  border-bottom: 1px solid #eee;
  align-items: flex-start;
}

.cart-header img {
  cursor: pointer;
  width: 24px;
  height: 24px;
  z-index: 2; /* mantiene la flecha clickeable */
}

.cart-header h3 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4rem;
  margin: 0;
  text-align: center;
}


  .cart-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 16px 100px; /* 👈 deja espacio para el footer fijo */
    color: #523B2B;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }

  .cart-item img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
  }

  .cart-item .info { flex: 1; }
  .cart-item .name { font-weight: 600; }
  .cart-item .meta { font-size: 0.9rem; color: #6b5643; }

  .remove {
    background: transparent;
    border: 0;
    font-size: 20px;
    color: #523B2B;
    cursor: pointer;
  }

  .close {
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 18px;
    background: #523B2B;
    color: #fff;
    cursor: pointer;
  }

  /* ✅ footer fijo al fondo */
  .cart-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #eee;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 5;
  }

  .total {
    font-size: 0.95rem;
    color: #523B2B;
  }

  .checkout {
    background: #523B2B;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s ease;
  }

  .checkout:hover { background: #3c2d21; }

  .cart-backdrop {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,.4);
    z-index: 1100;
  }
  .qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.qty-controls button {
  background: #f3f0ec;
  border: 1px solid #d7cfc7;
  color: #523B2B;
  font-size: 18px;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.qty-controls button:hover {
  background: #e5ddd5;
}

.qty-controls span {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
  color: #523B2B;
}


  @media (max-width: 600px) {
    .cart-drawer {
      width: 100%;
      right: -100%;
    }

    .cart-body {
      padding: 8px 14px 110px; /* 👈 espacio extra para el botón fijo */
    }

    .cart-footer {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 14px;
    }

    .checkout {
      width: 100%;
      padding: 14px 0;
      font-size: 1rem;
    }

    .total {
      text-align: center;
      font-size: 1rem;
      width: 100%;
    }
  }
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


  increase(item: CartItem) {
  this.cart.addItem(item, 1); // reutiliza tu servicio actual
  this.reload();
}

decrease(item: CartItem) {
  if (item.qty > 1) {
    item.qty--;
    localStorage.setItem(this.cart['storageKey'], JSON.stringify(this.cart.getItems()));
    this.reload();
  } else {
    this.remove(item.id);
  }
}

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
