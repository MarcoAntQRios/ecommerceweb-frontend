import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimeNgButtonModule } from '../../shared/modules/primeng-button.module';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeNgButtonModule],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">⚡ Tecnología al mejor precio</span>
        <h1>Encuentra el equipo<br><span class="highlight">perfecto para ti</span></h1>
        <p>Te ofrecemos los mejores productos tecnológicos con garantía, stock disponible y precios competitivos.</p>
      </div>
    </section>

    <!-- SELECTOR -->
    <section class="selector-section">
      <div class="selector-card">
        <div class="selector-left">
          <div class="selector-icon">🔍</div>
          <div>
            <h3>¿Qué deseas adquirir?</h3>
            <p>Selecciona el tipo de equipo y te orientamos hacia la mejor opción según tu perfil de uso.</p>
          </div>
        </div>
        <div class="selector-right">
          <select [(ngModel)]="categoriaSeleccionada" class="selector-input">
            <option value="">Selecciona una opción</option>
            <option value="Pc">🖥️ PC de Escritorio</option>
            <option value="Laptop">💻 Laptop</option>
          </select>
          <p-button
            label="Continuar →"
            (click)="irACategoria()"
            [disabled]="!categoriaSeleccionada">
          </p-button>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="como-funciona">
      <div class="section-container">
        <span class="section-badge">¿Cómo funciona?</span>
        <h2>Compra en 3 simples pasos</h2>
        <p class="section-subtitle">Rápido, seguro y sin complicaciones.</p>

        <div class="steps-grid">
          <div class="step-card">
            <div class="step-icon">🔍</div>
            <h3>Explora</h3>
            <p>Navega nuestro catálogo de productos y encuentra lo que necesitas.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🛒</div>
            <h3>Agrega al carrito</h3>
            <p>Selecciona tus productos y agrégalos al carrito con un clic.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">✅</div>
            <h3>Confirma tu pedido</h3>
            <p>Completa tu información y confirma tu compra de forma segura.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <div class="section-container">
        <span class="section-badge">Preguntas frecuentes</span>
        <h2>Todo lo que necesitas saber</h2>
        <p class="section-subtitle">Respuestas rápidas a las dudas más comunes.</p>

        <div class="faq-list">
          <div *ngFor="let item of faqs" class="faq-item" (click)="toggleFaq(item)">
            <div class="faq-question">
              <span>{{ item.pregunta }}</span>
              <i class="pi" [ngClass]="item.abierto ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </div>
            <div class="faq-answer" *ngIf="item.abierto">
              <p>{{ item.respuesta }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .hero {
      background: linear-gradient(135deg, #1a7a4a 0%, #2ecc71 100%);
      padding: 5rem 2rem;
      text-align: center;
      color: white;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .hero-badge {
      background: rgba(255,255,255,0.2);
      padding: 0.4rem 1.2rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
      color: white;
    }

    .highlight { color: #d4f5e2; }

    .hero p {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.85);
      max-width: 500px;
      margin: 0;
    }

    /* SELECTOR */
    .selector-section {
      background: white;
      padding: 0 2rem;
      margin-top: -2rem;
      position: relative;
      z-index: 1;
    }

    .selector-card {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .selector-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .selector-icon {
      font-size: 2rem;
      background: #d4f5e2;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .selector-left h3 {
      margin: 0 0 0.25rem;
      color: #333;
      font-size: 1.1rem;
    }

    .selector-left p {
      margin: 0;
      color: #666;
      font-size: 0.85rem;
    }

    .selector-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .selector-input {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 220px;
      cursor: pointer;
    }

    .selector-input:focus {
      outline: none;
      border-color: #2ecc71;
    }

    /* CÓMO FUNCIONA */
    .como-funciona {
      background: #f8fffe;
      padding: 5rem 2rem 4rem;
      text-align: center;
    }

    .section-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .section-badge {
      background: #d4f5e2;
      color: #1a7a4a;
      padding: 0.4rem 1.2rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .section-container h2 {
      font-size: 2rem;
      color: #1a7a4a;
      margin: 1rem 0 0.5rem;
    }

    .section-subtitle {
      color: #666;
      margin-bottom: 2.5rem;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .step-card {
      background: white;
      border-radius: 12px;
      padding: 2rem 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      border-top: 4px solid #2ecc71;
    }

    .step-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .step-card h3 {
      color: #1a7a4a;
      margin: 0 0 0.5rem;
    }

    .step-card p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    /* FAQ */
    .faq {
      background: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .faq-list {
      text-align: left;
      margin: 2rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .faq-item {
      border: 1px solid #e0f5ec;
      border-radius: 8px;
      padding: 1.25rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .faq-item:hover { background: #f8fffe; }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #333;
    }

    .faq-question i { color: #2ecc71; }

    .faq-answer {
      margin-top: 0.75rem;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .faq-answer p { margin: 0; }

    .faq-footer {
      background: #f8fffe;
      border: 1px solid #e0f5ec;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .faq-footer p {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .selector-card { flex-direction: column; }
      .selector-right { flex-direction: column; width: 100%; }
      .selector-input { width: 100%; }
      .faq-footer { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  categoriaSeleccionada = '';

  faqs = [
    {
      pregunta: '¿Cuál es la diferencia entre una PC y una laptop?',
      respuesta: 'Las PCs de escritorio ofrecen mayor potencia y son más fáciles de actualizar. Las laptops son portátiles y prácticas para trabajar desde cualquier lugar.',
      abierto: false
    },
    {
      pregunta: '¿Los productos tienen garantía?',
      respuesta: 'Sí, todos nuestros productos cuentan con garantía del fabricante. El tiempo varía según el producto.',
      abierto: false
    },
    {
      pregunta: '¿Cómo puedo ver el stock disponible?',
      respuesta: 'En cada producto verás el indicador de disponibilidad: "En stock", "Últimas unidades" o "Sin stock".',
      abierto: false
    },
    {
      pregunta: '¿Puedo cancelar mi pedido?',
      respuesta: 'Puedes cancelar tu pedido mientras esté en estado PENDIENTE. Contacta con nosotros para más información.',
      abierto: false
    }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void { }

  irACategoria(): void {
    if (this.categoriaSeleccionada) {
      this.router.navigate(['/recomendador'], {
        queryParams: { tipo: this.categoriaSeleccionada }
      });
    }
  }

  irAProductos(): void {
    this.router.navigate(['/products']);
  }

  toggleFaq(item: any): void {
    item.abierto = !item.abierto;
  }
}