import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <nav class="admin-nav">
        <h3>Admin</h3>
        <a routerLink="/admin/products" routerLinkActive="active">Productos</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Órdenes</a>
      </nav>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      gap: 0;
    }

    .admin-nav {
      width: 200px;
      background: #2c3e50;
      color: white;
      padding: 1rem;
      position: sticky;
      top: 80px;
      height: calc(100vh - 80px);
    }

    .admin-nav h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }

    .admin-nav a {
      display: block;
      padding: 0.75rem 1rem;
      color: #ecf0f1;
      text-decoration: none;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      transition: background 0.3s;
    }

    .admin-nav a:hover {
      background: #34495e;
    }

    .admin-nav a.active {
      background: #007bff;
      color: white;
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent { }