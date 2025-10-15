import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'aw_cart_v1';
  private ordersKey = 'aw_orders_v1';
  private items: CartItem[] = [];
  // control del drawer
  private _drawerOpen$ = new BehaviorSubject<boolean>(false);
  drawerOpen$ = this._drawerOpen$.asObservable();
  // reactividad del carrito
  private _items$ = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items$.asObservable();
  private _count$ = new BehaviorSubject<number>(0);
  count$ = this._count$.asObservable();
  // evento de confirmación al añadir item (emite id del producto añadido)
  private _itemAdded$ = new BehaviorSubject<number | null>(null);
  itemAdded$ = this._itemAdded$.asObservable();

  constructor() {
    this.load();
  }

  openDrawer() { this._drawerOpen$.next(true); }
  closeDrawer() { this._drawerOpen$.next(false); }
  toggleDrawer() { this._drawerOpen$.next(!this._drawerOpen$.value); }

  private load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.items = raw ? JSON.parse(raw) : [];
    } catch (e) { this.items = []; }
    this.emit();
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.emit();
  }

  private emit() {
    this._items$.next([...this.items]);
    const count = this.items.reduce((s, i) => s + i.qty, 0);
    this._count$.next(count);
  }

  getItems() { return [...this.items]; }

  addItem(item: Omit<CartItem,'qty'>, qty = 1) {
    const found = this.items.find(i => i.id === item.id);
    if (found) {
      found.qty += qty;
    } else {
      this.items.push({ ...item, qty });
    }
    this.save();
    // emitir evento de añadido
    this._itemAdded$.next(item.id);
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotal() {
    return this.items.reduce((s, i) => s + (i.price * i.qty), 0);
  }

  checkout(): Order {
    const now = new Date();
    const order: Order = {
      id: 'order_' + now.getTime(),
      createdAt: now.toISOString(),
      items: this.getItems(),
      total: this.getTotal()
    };
    // persistir orden
    const all = this.getOrders();
    all.unshift(order);
    localStorage.setItem(this.ordersKey, JSON.stringify(all));
    // limpiar carrito
    this.clear();
    return order;
  }

  getOrders(): Order[] {
    try {
      const raw = localStorage.getItem(this.ordersKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
}
