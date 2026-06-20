import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon"><i class="pi pi-shield"></i></span>
        <div class="brand-text">
          <span class="brand-title">Panel Admin</span>
          <span class="brand-subtitle">Gestión de la tienda</span>
        </div>
      </div>

      <nav class="menu">
        <span class="menu-label">Administración</span>

        <a routerLink="/admin/dashboard" routerLinkActive="active" class="menu-item">
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </a>
        <a routerLink="/admin/products" routerLinkActive="active" class="menu-item">
          <i class="pi pi-box"></i>
          <span>Productos</span>
        </a>
        <a routerLink="/admin/orders" routerLinkActive="active" class="menu-item">
          <i class="pi pi-receipt"></i>
          <span>Órdenes</span>
        </a>
        <a routerLink="/admin/users" routerLinkActive="active" class="menu-item">
          <i class="pi pi-users"></i>
          <span>Usuarios</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 264px;
      flex-shrink: 0;
      background: #fff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
    }

    /* Marca */
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1.25rem 1.25rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1d4ed8;
      font-size: 1.05rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.25;
    }

    .brand-subtitle {
      font-size: 0.72rem;
      color: #9ca3af;
      line-height: 1.3;
    }

    /* Menú */
    .menu {
      flex: 1;
      padding: 1rem 0.85rem;
      display: flex;
      flex-direction: column;
    }

    .menu-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #9ca3af;
      padding: 0 0.5rem;
      margin-bottom: 0.6rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.9rem;
      color: #374151;
      text-decoration: none;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 500;
      margin-bottom: 0.3rem;
      transition: background 0.15s, color 0.15s;
    }

    .menu-item i {
      font-size: 1rem;
      width: 20px;
      text-align: center;
      color: #6b7280;
      transition: color 0.15s;
    }

    .menu-item:hover {
      background: #eff6ff;
      color: #2563eb;
    }

    .menu-item:hover i {
      color: #2563eb;
    }

    .menu-item.active {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #fff;
      box-shadow: 0 3px 10px rgba(37, 99, 235, 0.28);
    }

    .menu-item.active i {
      color: #fff;
    }

    /* Volver a la tienda */
    .back-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 1rem 1.25rem;
      border-top: 1px solid #f3f4f6;
      color: #6b7280;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: color 0.15s;
    }

    .back-link i {
      font-size: 0.85rem;
    }

    .back-link:hover {
      color: #2563eb;
    }

    /* Mobile: barra horizontal en vez de desaparecer */
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        flex-direction: row;
        align-items: center;
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .sidebar-brand,
      .back-link {
        display: none;
      }

      .menu {
        flex: none;
        flex-direction: row;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.75rem;
        width: max-content;
      }

      .menu-label {
        display: none;
      }

      .menu-item {
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.68rem;
        white-space: nowrap;
        margin-bottom: 0;
      }

      .menu-item i {
        font-size: 1.05rem;
        width: auto;
      }
    }
  `]
})
export class SidebarComponent { }