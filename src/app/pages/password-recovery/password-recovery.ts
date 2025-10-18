import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './password-recovery.html',
  styleUrls: ['./password-recovery.css']
})
export class PasswordRecovery {
  email = '';
  emailSent = false;

  constructor(private router: Router) {}

  sendRecoveryEmail() {
    if (!this.email) return;
    this.emailSent = true;
    console.log('Correo de recuperación enviado a:', this.email);
  }

  resendEmail() {
    console.log('Reenviando correo a:', this.email);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
