import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

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
  // URL de tu endpoint de login en API Gateway
  private readonly apiUrl = 'https://pjq6h9odc7.execute-api.us-east-1.amazonaws.com/v1/login';

  user$ = this.userSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

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
  /**
   * Realiza el login contra el backend real.
   * Devuelve un Observable con el usuario si es exitoso, o un error si falla.
   */
  loginHttp(email: string, password: string): Observable<AwUser> {
    // El cuerpo de la petición dependerá de lo que espere tu backend
    return this.http.post<AwUser>(this.apiUrl, { email, password }).pipe(
      tap(user => {
        // Si el login es exitoso, el backend devuelve el usuario.
        // Lo guardamos en el estado de la aplicación.
        this.login(user);
        this.router.navigateByUrl('/');
      }),
      catchError(error => {
        // Propagamos el error para que el componente de login lo maneje
        return throwError(() => new Error('Email o contraseña incorrectos.'));
      })
    );
  }

  loginAsAdmin() {
    this.writeUser(ADMIN_USER);
    this.userSubject.next(ADMIN_USER);
  }

  logout() {
    this.writeUser(null);
    this.userSubject.next(null);
    this.router.navigate(['/']); // ✅ redirige al home después de cerrar sesión
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
