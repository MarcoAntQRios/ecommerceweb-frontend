import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PrimeNgButtonModule } from '../../shared/modules/primeng-button.module';
import { ApiService } from '../../core/services/api.service';
import { IProduct } from '../../core/models/product.model';

@Component({
  selector: 'app-recomendador',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
  template: `
    <div class="recomendador">

      <!-- STEPPER -->
      <div class="stepper">
        <div class="step" [ngClass]="{'active': paso >= 1, 'done': paso > 1}">
          <span class="step-number">{{ paso > 1 ? '✓' : '1' }}</span>
          <span class="step-label">Tipo</span>
        </div>
        <div class="step-line" [ngClass]="{'active': paso > 1}"></div>
        <div class="step" [ngClass]="{'active': paso >= 2, 'done': paso > 2}">
          <span class="step-number">{{ paso > 2 ? '✓' : '2' }}</span>
          <span class="step-label">Uso</span>
        </div>
        <div class="step-line" [ngClass]="{'active': paso > 2}"></div>
        <div class="step" [ngClass]="{'active': paso >= 3, 'done': paso > 3}">
          <span class="step-number">{{ paso > 3 ? '✓' : '3' }}</span>
          <span class="step-label">Presupuesto</span>
        </div>
        <div class="step-line" [ngClass]="{'active': paso > 3}"></div>
        <div class="step" [ngClass]="{'active': paso >= 4}">
          <span class="step-number">4</span>
          <span class="step-label">Resultado</span>
        </div>
      </div>

      <!-- PASO 1 - TIPO -->
      <div *ngIf="paso === 1" class="paso-container">
        <span class="paso-badge">Paso 1 de 3</span>
        <h2>¿Qué tipo de equipo buscas?</h2>
        <p>Selecciona el tipo de equipo y te ayudamos a encontrar el ideal.</p>
        <div class="opciones-grid">
          <div class="opcion-card" [ngClass]="{'selected': tipoSeleccionado === 'Pc'}" (click)="seleccionarTipo('Pc')">
            <div class="opcion-icon">🖥️</div>
            <h3>PC de Escritorio</h3>
            <p>Mayor potencia, fácil de actualizar y mejor rendimiento por precio.</p>
            <div class="opcion-tags">
              <span class="otag">Alto rendimiento</span>
              <span class="otag">Actualizable</span>
            </div>
          </div>
          <div class="opcion-card" [ngClass]="{'selected': tipoSeleccionado === 'Laptop'}" (click)="seleccionarTipo('Laptop')">
            <div class="opcion-icon">💻</div>
            <h3>Laptop</h3>
            <p>Portátil, práctica y perfecta para trabajar desde cualquier lugar.</p>
            <div class="opcion-tags">
              <span class="otag">Portátil</span>
              <span class="otag">Versátil</span>
            </div>
          </div>
        </div>
        <div class="paso-footer">
          <p-button label="← Volver al inicio" [text]="true" severity="secondary" (click)="irAHome()"></p-button>
          <p-button label="Continuar →" (click)="siguientePaso()" [disabled]="!tipoSeleccionado"></p-button>
        </div>
      </div>

      <!-- PASO 2 - USO -->
      <div *ngIf="paso === 2" class="paso-container">
        <span class="paso-badge">Paso 2 de 3</span>
        <span class="tipo-badge">{{ tipoSeleccionado === 'Pc' ? '🖥️ PC' : '💻 Laptop' }} seleccionado</span>
        <h2>¿Para qué usarás el equipo?</h2>
        <p>Elige tu uso principal y ajustamos las recomendaciones.</p>
        <div class="opciones-grid">
          <div class="opcion-card" *ngFor="let uso of usos"
            [ngClass]="{'selected': usoSeleccionado === uso.valor}"
            (click)="seleccionarUso(uso.valor)">
            <div class="opcion-icon">{{ uso.icon }}</div>
            <h3>{{ uso.nombre }}</h3>
            <p>{{ uso.descripcion }}</p>
            <div class="opcion-tags">
              <span class="otag" *ngFor="let tag of uso.tags">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="paso-footer">
          <p-button label="← Atrás" [text]="true" severity="secondary" (click)="anteriorPaso()"></p-button>
          <p-button label="Continuar →" (click)="siguientePaso()" [disabled]="!usoSeleccionado"></p-button>
        </div>
      </div>

      <!-- PASO 3 - PRESUPUESTO -->
      <div *ngIf="paso === 3" class="paso-container">
        <span class="paso-badge">Paso 3 de 3</span>
        <h2>¿Cuál es tu presupuesto?</h2>
        <p>Te mostramos productos dentro de tu rango de precio.</p>
        <div class="opciones-grid">
          <div class="opcion-card" *ngFor="let rango of rangos"
            [ngClass]="{'selected': rangoSeleccionado === rango.valor}"
            (click)="seleccionarRango(rango.valor)">
            <div class="opcion-icon">{{ rango.icon }}</div>
            <h3>{{ rango.nombre }}</h3>
            <p>{{ rango.descripcion }}</p>
          </div>
        </div>
        <div class="paso-footer">
          <p-button label="← Atrás" [text]="true" severity="secondary" (click)="anteriorPaso()"></p-button>
          <p-button label="Ver resultados →" (click)="verResultados()" [disabled]="!rangoSeleccionado"></p-button>
        </div>
      </div>

      <!-- PASO 4 - RESULTADOS -->
      <div *ngIf="paso === 4" class="paso-container">
        <h2>🎯 Productos recomendados para ti</h2>
        <p>Según tu selección: <strong>{{ tipoSeleccionado === 'Pc' ? 'PC' : 'Laptop' }}</strong> · <strong>{{ usoSeleccionado }}</strong> · <strong>{{ rangoNombre }}</strong></p>

        <div *ngIf="productosFiltrados.length === 0" class="sin-resultados">
          <p>😔 No encontramos productos con esos criterios.</p>
          <p-button label="Ver todos los productos" (click)="irAProductos()"></p-button>
        </div>

        <div class="productos-grid">
          <div *ngFor="let product of productosFiltrados" class="product-card">
            <div class="stock-badge" [ngClass]="{
              'sin-stock': product.stock === 0,
              'poco-stock': product.stock > 0 && product.stock < 5,
              'en-stock': product.stock >= 5
            }">
              {{ product.stock === 0 ? 'Sin stock' : product.stock < 5 ? 'Últimas unidades' : 'En stock' }}
            </div>
            <img [src]="product.imagen" [alt]="product.nombre" class="product-image"
              (error)="onImageError($event)" />
            <div class="product-info">
              <h3>{{ product.nombre }}</h3>
              <p>{{ product.descripcion }}</p>
              <div class="product-footer">
                <span class="price">S/ {{ product.precio | number:'1.0-0' }}</span>
                <p-button label="Agregar" icon="pi pi-shopping-cart" size="small" (click)="irAProductos()"></p-button>
              </div>
            </div>
          </div>
        </div>

        <div class="paso-footer" style="margin-top: 2rem">
          <p-button label="← Volver a empezar" [text]="true" severity="secondary" (click)="reiniciar()"></p-button>
          <p-button label="Ver catálogo completo" icon="pi pi-arrow-right" (click)="irAProductos()"></p-button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .recomendador {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* STEPPER */
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3rem;
      gap: 0;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .step-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e0e0e0;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .step.active .step-number {
      background: #2ecc71;
      color: white;
    }

    .step.done .step-number {
      background: #1a7a4a;
      color: white;
    }

    .step-label {
      font-size: 0.75rem;
      color: #999;
      font-weight: 500;
    }

    .step.active .step-label { color: #1a7a4a; font-weight: 600; }

    .step-line {
      flex: 1;
      height: 2px;
      background: #e0e0e0;
      margin: 0 0.5rem;
      margin-bottom: 1rem;
    }

    .step-line.active { background: #2ecc71; }

    /* PASO */
    .paso-container {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }

    .paso-badge {
      background: #d4f5e2;
      color: #1a7a4a;
      padding: 0.3rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .tipo-badge {
      background: #e8f4ff;
      color: #007bff;
      padding: 0.3rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 0.5rem;
      margin-left: 0.5rem;
    }

    .paso-container h2 {
      color: #333;
      margin: 0.5rem 0;
      font-size: 1.75rem;
    }

    .paso-container > p {
      color: #666;
      margin-bottom: 2rem;
    }

    /* OPCIONES */
    .opciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .opcion-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .opcion-card:hover {
      border-color: #2ecc71;
      background: #f8fffe;
    }

    .opcion-card.selected {
      border-color: #2ecc71;
      background: #f0fdf6;
      box-shadow: 0 0 0 3px rgba(46,204,113,0.2);
    }

    .opcion-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .opcion-card h3 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 1rem;
    }

    .opcion-card p {
      margin: 0 0 0.75rem;
      color: #666;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .opcion-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .otag {
      background: #f0f0f0;
      color: #555;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
    }

    .opcion-card.selected .otag {
      background: #d4f5e2;
      color: #1a7a4a;
    }

    /* FOOTER */
    .paso-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
    }

    /* RESULTADOS */
    .sin-resultados {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      position: relative;
    }

    .stock-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 1;
    }

    .sin-stock { background: #f8d7da; color: #842029; }
    .poco-stock { background: #fff3cd; color: #856404; }
    .en-stock { background: #d1e7dd; color: #0f5132; }

    .product-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .product-info { padding: 1rem; }

    .product-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: #333;
    }

    .product-info p {
      margin: 0 0 1rem;
      color: #666;
      font-size: 0.85rem;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid #f0f0f0;
    }

    .price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2ecc71;
    }

    @media (max-width: 768px) {
      .recomendador { padding: 1rem; }
      .paso-container { padding: 1.5rem; }
      .opciones-grid { grid-template-columns: 1fr; }
      .paso-footer { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class RecomendadorComponent implements OnInit {
  paso = 1;
  tipoSeleccionado = '';
  usoSeleccionado = '';
  rangoSeleccionado = '';
  rangoNombre = '';
  productos: IProduct[] = [];
  productosFiltrados: IProduct[] = [];

  usos = [
    { valor: 'Gaming', nombre: 'Gaming', icon: '🎮', descripcion: 'Juegos AAA, fps estable y experiencias de alto rendimiento.', tags: ['GPU dedicada', '16 GB RAM+'] },
    { valor: 'Estudio', nombre: 'Estudio', icon: '📚', descripcion: 'Tareas, apuntes, videollamadas y navegación en el aula.', tags: ['Batería larga', 'Ligero'] },
    { valor: 'Diseño', nombre: 'Diseño', icon: '🎨', descripcion: 'Edición de imagen, video 4K y producción creativa.', tags: ['sRGB 100%', 'SSD NVMe'] },
    { valor: 'Oficina', nombre: 'Oficina', icon: '💼', descripcion: 'Documentos, correo, hojas de cálculo y reuniones online.', tags: ['Multi-puerto', 'Teclado cómodo'] }
  ];

  rangos = [
    { valor: '0-2000', nombre: 'Menos de S/ 2,000', icon: '💰', descripcion: 'Ideal para uso básico y estudio.' },
    { valor: '2000-4000', nombre: 'S/ 2,000 - S/ 4,000', icon: '💵', descripcion: 'Buen rendimiento para trabajo y estudio.' },
    { valor: '4000-6000', nombre: 'S/ 4,000 - S/ 6,000', icon: '💎', descripcion: 'Alto rendimiento para diseño y gaming.' },
    { valor: '6000-99999', nombre: 'Más de S/ 6,000', icon: '🚀', descripcion: 'Lo mejor del mercado sin compromisos.' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const tipo = this.route.snapshot.queryParams['tipo'];
    if (tipo) {
      this.tipoSeleccionado = tipo;
      this.paso = 2;
    }
    this.apiService.getProducts().subscribe(products => this.productos = products);
  }

  seleccionarTipo(tipo: string): void { this.tipoSeleccionado = tipo; }
  seleccionarUso(uso: string): void { this.usoSeleccionado = uso; }
  seleccionarRango(rango: string): void {
    this.rangoSeleccionado = rango;
    this.rangoNombre = this.rangos.find(r => r.valor === rango)?.nombre ?? '';
  }

  // Al avanzar, limpiamos los pasos siguientes para evitar
  // que queden selecciones "fantasma" si el usuario volvió y cambió algo
  siguientePaso(): void {
    if (this.paso === 1) {
      this.usoSeleccionado = '';
      this.rangoSeleccionado = '';
      this.rangoNombre = '';
    }
    if (this.paso === 2) {
      this.rangoSeleccionado = '';
      this.rangoNombre = '';
    }
    this.paso++;
  }

  // Al retroceder, limpiamos la selección del paso actual
  // para que el usuario parta limpio si decide cambiarla
  anteriorPaso(): void {
    if (this.paso === 2) this.usoSeleccionado = '';
    if (this.paso === 3) {
      this.rangoSeleccionado = '';
      this.rangoNombre = '';
    }
    this.paso--;
  }

  verResultados(): void {
    const [min, max] = this.rangoSeleccionado.split('-').map(Number);
    this.productosFiltrados = this.productos.filter(p =>
      p.tipoNombre.toLowerCase() === this.tipoSeleccionado.toLowerCase() &&
      p.precio >= min &&
      p.precio <= max
    );
    this.paso = 4;
  }

  irAHome(): void { this.router.navigate(['/']); }
  irAProductos(): void { this.router.navigate(['/products']); }
  reiniciar(): void {
    this.paso = 1;
    this.tipoSeleccionado = '';
    this.usoSeleccionado = '';
    this.rangoSeleccionado = '';
    this.rangoNombre = '';
    this.productosFiltrados = [];
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/300x200?text=Sin+Imagen';
  }
}