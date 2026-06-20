import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../core/services/product.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { PrimeNgTableModule } from '../../../../shared/modules/primeng-table.module';
import { IProduct } from '../../../../core/models/product.model';
import { IUsuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgTableModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  productos: IProduct[] = [];
  usuarios: IUsuario[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    this.loading = true;
    forkJoin({
      productos: this.productService.getProducts(),
      usuarios: this.usuarioService.getUsuarios()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ productos, usuarios }) => {
          this.productos = productos ?? [];
          this.usuarios = usuarios ?? [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  get todosUsuarios(): IUsuario[] {
    return this.usuarios;
  }

  get soloClientes(): IUsuario[] {
    return this.usuarios.filter(u => (u.rolNombre ?? '').toUpperCase().includes('CLIENTE'));
  }

  get soloAdmins(): IUsuario[] {
    return this.usuarios.filter(u => (u.rolNombre ?? '').toUpperCase().includes('ADMIN'));
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get productosOrdenados(): IProduct[] {
    return [...this.productos].sort((a, b) => a.id - b.id);
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get valorInventario(): number {
    return this.productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  }

  get productosDisponibles(): IProduct[] {
    return this.productos.filter(p => p.stock > 0);
  }

  get productosAgotados(): IProduct[] {
    return this.productos.filter(p => p.stock <= 0);
  }

  get productosStockBajo(): IProduct[] {
    return this.productos.filter(p => p.stock > 0 && p.stock <= 5);
  }

  get totalUnidadesStock(): number {
    return this.productos.reduce((acc, p) => acc + p.stock, 0);
  }

  estadoStock(stock: number): 'Agotado' | 'Stock bajo' | 'Disponible' {
    if (stock <= 0) return 'Agotado';
    if (stock <= 5) return 'Stock bajo';
    return 'Disponible';
  }

  estadoClase(stock: number): string {
    if (stock <= 0) return 'badge-danger';
    if (stock <= 5) return 'badge-warning';
    return 'badge-success';
  }
}