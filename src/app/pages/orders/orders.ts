import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  template: `
    <section class="page">
      <h2>🧾 Mis pedidos</h2>
      <p>Bienvenido, aquí verás tus pedidos recientes.</p>
      <div class="orders-list">
        <p><strong>Pedido #001:</strong> Cardigan Tradicional - S/79.90</p>
        <p><strong>Pedido #002:</strong> Poncho Beige Tradicional - S/89.90</p>
      </div>
    </section>
  `,
  styles: [`
    .page {
      font-family: 'Quicksand', sans-serif;
      padding: 2rem;
      color: #523b2b;
    }
    h2 {
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .orders-list p {
      background: #f5e9dd;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
  `]
})
export class Orders {}
