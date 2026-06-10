import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PrimeNgButtonModule } from '../../shared/modules/primeng-button.module';
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../core/models/product.model';

@Component({
  selector: 'app-recomendador',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
  templateUrl: 'recomendador.component.html',
  styleUrls: ['recomendador.component.css']
})
export class RecomendadorComponent implements OnInit {
  paso = 1;
  categoriaSeleccionada = '';
  usoSeleccionado = '';
  rangoSeleccionado = '';
  rangoNombre = '';
  productos: IProduct[] = [];
  productosFiltrados: IProduct[] = [];

  usos = [
    { valor: 'Gaming',  nombre: 'Gaming',  icon: '🎮', descripcion: 'Juegos AAA, fps estable y experiencias de alto rendimiento.', tags: ['GPU dedicada', '16 GB RAM+'] },
    { valor: 'estudio', nombre: 'Estudio',  icon: '📚', descripcion: 'Tareas, apuntes, videollamadas y navegación en el aula.',     tags: ['Batería larga', 'Ligero'] },
    { valor: 'edicion', nombre: 'Edición',  icon: '🎨', descripcion: 'Edición de imagen, video 4K y producción creativa.',           tags: ['sRGB 100%', 'SSD NVMe'] },
    { valor: 'oficina', nombre: 'Oficina',  icon: '💼', descripcion: 'Documentos, correo, hojas de cálculo y reuniones online.',     tags: ['Multi-puerto', 'Teclado cómodo'] }
  ];

  rangos = [
    { valor: '0-2000',     nombre: 'Menos de S/ 2,000',      icon: '💰', descripcion: 'Ideal para uso básico y estudio.' },
    { valor: '2000-4000',  nombre: 'S/ 2,000 - S/ 4,000',    icon: '💵', descripcion: 'Buen rendimiento para trabajo y estudio.' },
    { valor: '4000-6000',  nombre: 'S/ 4,000 - S/ 6,000',    icon: '💎', descripcion: 'Alto rendimiento para diseño y gaming.' },
    { valor: '6000-99999', nombre: 'Más de S/ 6,000',         icon: '🚀', descripcion: 'Lo mejor del mercado sin compromisos.' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => this.productos = products);
  }

  seleccionarCategoria(categoria: string): void { this.categoriaSeleccionada = categoria; }
  seleccionarUso(uso: string): void { this.usoSeleccionado = uso; }
  seleccionarRango(rango: string): void {
    this.rangoSeleccionado = rango;
    this.rangoNombre = this.rangos.find(r => r.valor === rango)?.nombre ?? '';
  }

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

  anteriorPaso(): void {
    if (this.paso === 2) this.usoSeleccionado = '';
    if (this.paso === 3) { this.rangoSeleccionado = ''; this.rangoNombre = ''; }
    this.paso--;
  }

  verResultados(): void {
    const [min, max] = this.rangoSeleccionado.split('-').map(Number);
    this.productosFiltrados = this.productos.filter(p =>
      p.categoriaNombre?.toLowerCase() === this.categoriaSeleccionada.toLowerCase() &&
      p.tipoNombre?.toLowerCase() === this.usoSeleccionado.toLowerCase() &&
      p.precio >= min &&
      p.precio <= max
    );
    this.paso = 4;
  }

  irAHome(): void { this.router.navigate(['/']); }
  irAProductos(): void { this.router.navigate(['/products']); }

  reiniciar(): void {
    this.paso = 1;
    this.categoriaSeleccionada = '';
    this.usoSeleccionado = '';
    this.rangoSeleccionado = '';
    this.rangoNombre = '';
    this.productosFiltrados = [];
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/300x200?text=Sin+Imagen';
  }
}