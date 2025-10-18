import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  loginError = '';
  submitted = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.loginError = '';

    if (form.invalid) {
      return;
    }

    // Acceso especial para el administrador durante el desarrollo
    if (this.email === 'admin@andeswarmi.com' && this.password === '123456') {
      this.auth.loginAsAdmin(); // Usamos el método específico para el admin
      this.router.navigateByUrl('/');
      return;
    }

    this.loading = true;

    this.auth
      .loginHttp(this.email, this.password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        // El success es manejado dentro del servicio (redirección)
        // por lo que aquí solo necesitamos manejar el error.
        error: err => {
          this.loginError = err.message || 'Ocurrió un error inesperado.';
        }
      });
  }
}
