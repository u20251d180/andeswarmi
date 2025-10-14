import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AwUser {
  email: string;
  name?: string;
  role?: 'admin' | 'user';
}


const STORAGE_KEY = 'aw_user';

const ADMIN_USER: AwUser = {
  email: 'admin@andeswarmi.com',
  name: 'Administrador',
  role: 'admin'
};


@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AwUser | null>(this.readUser());
  user$ = this.userSubject.asObservable();

  private readUser(): AwUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private writeUser(user: AwUser | null) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  login(user: AwUser) {
    this.writeUser(user);
    this.userSubject.next(user);
  }

 loginAsAdmin() {
    this.writeUser(ADMIN_USER);
    this.userSubject.next(ADMIN_USER);
  }

  logout() {
    this.writeUser(null);
    this.userSubject.next(null);
  }

  get currentUser() {
    return this.userSubject.value;
  }

  get isLoggedIn() {
    return !!this.userSubject.value;
  }

   get isAdmin() {
    return this.userSubject.value?.role === 'admin';
  }
}
