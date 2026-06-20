import { Component, inject, computed } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';

import { SidebarComponent  } from './shared/components/sidebar/sidebar.component';

import { FooterComponent } from './shared/components/footer/footer.component';

import { AuthService } from './core/services/auth.service';

@Component({

  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],

  templateUrl: './app.html',

  styleUrl: './app.css'

})

export class App {

  private authService = inject(AuthService);

  showSidebar = computed(() => this.authService.isAdmin());

}