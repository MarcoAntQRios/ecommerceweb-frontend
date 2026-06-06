import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="menu">
        <div class="menu-section">
          <h3>📦 Productos</h3>
          <a routerLink="/products" routerLinkActive="active" class="menu-item">
            <i class="pi pi-list"></i> Listar Productos
          </a>
        </div>

        <div class="menu-section">
          <h3>⚙️ Administración</h3>
          <a routerLink="/admin/products" routerLinkActive="active" class="menu-item">
            <i class="pi pi-box"></i> Productos
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="menu-item">
            <i class="pi pi-receipt"></i> Órdenes
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="menu-item">
          <i class="pi pi-users"></i> Usuarios
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      min-height: calc(100vh - 80px);
      padding: 1rem;
      position: sticky;
      top: 80px;
    }

    .menu-section {
      margin-bottom: 2rem;
    }

    .menu-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #555;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.3s;
      margin-bottom: 0.5rem;
    }

    .menu-item:hover {
      background: #e8f4ff;
      color: #007bff;
      padding-left: 1.25rem;
    }

    .menu-item.active {
      background: #007bff;
      color: white;
    }

    .menu-item i {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class SidebarComponent { }