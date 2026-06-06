import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <app-header></app-header>
    <div class="container">
      <app-sidebar></app-sidebar>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      gap: 0;
      min-height: calc(100vh - 80px);
    }

    .content {
      flex: 1;
      padding: 2rem;
      background: #fafafa;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }

      .content {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'ecommerceweb';
}