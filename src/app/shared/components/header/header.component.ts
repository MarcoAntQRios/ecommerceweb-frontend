import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { PrimeNgMenuModule } from '../../modules/primeng-menu.module';
import { PrimeNgButtonModule } from '../../modules/primeng-button.module';
import { CartService } from '../../../core/services/cart.service';
import { Subject, filter, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MegaMenuItem, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgMenuModule, PrimeNgButtonModule, MegaMenuModule, MenuModule],
   templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenu!: Menu;

  sidebarVisible = false;
  cart$;
  megaMenuItems: MegaMenuItem[] = [];
  userMenuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();
  private routerSub!: Subscription;

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$.pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void {
    this.buildMenu();
    this.buildUserMenu();
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.buildMenu());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerSub?.unsubscribe();
  }

  showCart(): void { this.sidebarVisible = true; }

  increaseQuantity(productId: number): void {
    const cart = this.cartService.getCartSnapshot();
    const item = cart.items.find(i => i.product.id === productId);
    if (item) this.cartService.updateQuantity(productId, item.quantity + 1);
  }

  decreaseQuantity(productId: number): void {
    const cart = this.cartService.getCartSnapshot();
    const item = cart.items.find(i => i.product.id === productId);
    if (item && item.quantity > 1) this.cartService.updateQuantity(productId, item.quantity - 1);
  }

  removeItem(productId: number): void { this.cartService.removeFromCart(productId); }

  goToCheckout(): void {
    this.sidebarVisible = false;
    this.router.navigate(['/checkout']);
  }

  private buildUserMenu(): void {
  this.userMenuItems = [
    {
      label: 'Iniciar sesión',
      icon: 'pi pi-sign-in',
      command: () => this.router.navigate(['/login'])
    },
    { separator: true },
    {
      label: 'Registrarse',
      icon: 'pi pi-user-plus',
      command: () => this.router.navigate(['/register'])
    }
  ];
}

  private buildMenu(): void {
    const url = this.router.url;
    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString ?? '');
    const categoriaActiva = params.get('categoria');
    const tipoActivo = params.get('tipo');
    const enHome = path === '/';
    const enProductos = path.startsWith('/products');

    this.megaMenuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
        styleClass: enHome ? 'active-root' : ''
      },
      {
        label: 'Productos',
        icon: 'pi pi-desktop',
        styleClass: enProductos ? 'active-root' : '',
        items: [
          [{
            label: 'PC',
            items: this.buildSubItems('Pc', [
              { label: 'Gaming',  tipo: 'Gaming',  icon: 'pi pi-play-circle' },
              { label: 'Estudio', tipo: 'Estudio', icon: 'pi pi-book' },
              { label: 'Oficina', tipo: 'Oficina', icon: 'pi pi-briefcase' },
              { label: 'Edicion',  tipo: 'Edicion',  icon: 'pi pi-palette' },
            ], categoriaActiva, tipoActivo)
          }],
          [{
            label: 'Laptop',
            items: this.buildSubItems('Laptop', [
              { label: 'Gaming',  tipo: 'Gaming',  icon: 'pi pi-play-circle' },
              { label: 'Estudio', tipo: 'Estudio', icon: 'pi pi-book' },
              { label: 'Oficina', tipo: 'Oficina', icon: 'pi pi-briefcase' },
              { label: 'Edicion',  tipo: 'Edicion',  icon: 'pi pi-palette' },
            ], categoriaActiva, tipoActivo)
          }],
          [{
            label: 'Perifericos',
            items: this.buildSubItems('Perifericos', [
              { label: 'Monitores',   tipo: 'Monitores', icon: 'pi pi-desktop' },
              { label: 'Teclados',    tipo: 'Teclado',  icon: 'pi pi-table' },
              { label: 'Mouse',       tipo: 'Mouse',     icon: 'pi pi-stop-circle' },
              { label: 'Auriculares', tipo: 'Audio',     icon: 'pi pi-headphones' },
              { label: 'Webcams',     tipo: 'Webcam',    icon: 'pi pi-video' },
            ], categoriaActiva, tipoActivo)
          }],
          [{
            label: 'Componentes',
            items: this.buildSubItems('Componentes', [
              { label: 'Procesadores',      tipo: 'Procesadores', icon: 'pi pi-microchip' },
              { label: 'Tarjetas Gráficas', tipo: 'Gpu',          icon: 'pi pi-objects-column' },
              { label: 'Memorias RAM',      tipo: 'Ram',          icon: 'pi pi-server' },
              { label: 'Almacenamiento',    tipo: 'Storage',      icon: 'pi pi-database' },
              { label: 'Placas Base',       tipo: 'Motherboard',  icon: 'pi pi-microchip-ai' },
            ], categoriaActiva, tipoActivo)
          }],
        ]
      }
    ];
  }

  private buildSubItems(
    categoria: string,
    items: { label: string; tipo: string; icon: string }[],
    categoriaActiva: string | null,
    tipoActivo: string | null
  ): MegaMenuItem[] {
    return items.map(item => ({
      label: item.label,
      icon: item.icon,
      routerLink: '/products',
      queryParams: { categoria, tipo: item.tipo },
      styleClass: (categoria === categoriaActiva && item.tipo === tipoActivo) ? 'active-sub' : ''
    }));
  }
}