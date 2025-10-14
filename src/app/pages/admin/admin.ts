import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <section class="page">
      <h2>👑 Panel de Administración</h2>
      <p>Bienvenido, administrador. Aquí podrás gestionar productos y pedidos.</p>

      <div class="admin-actions">
        <button>🧺 Ver productos</button>
        <button>📦 Revisar pedidos</button>
        <button>👤 Ver usuarios</button>
      </div>
    </section>
  `,
  styles: [`
    .page {
      font-family: 'Quicksand', sans-serif;
      padding: 2rem;
      color: #523b2b;
    }
    .admin-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    button {
      background: #523b2b;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #6d4a36;
    }
  `]
})
export class AdminDashboard {}
