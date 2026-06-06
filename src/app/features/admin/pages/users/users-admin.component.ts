import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { PrimeNgTableModule } from '../../../../shared/modules/primeng-table.module';
import { PrimeNgButtonModule } from '../../../../shared/modules/primeng-button.module';
import { PrimeNgDialogModule } from '../../../../shared/modules/primeng-dialog.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUsuario, IUsuarioRequest } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgTableModule, PrimeNgButtonModule, PrimeNgDialogModule],
  template: `
    <div class="users-admin">
      <h2>Gestión de Usuarios</h2>

      <p-table [value]="usuarios" [rows]="10" [paginator]="true" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
            <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
            <th pSortableColumn="apellido">Apellido <p-sortIcon field="apellido"></p-sortIcon></th>
            <th pSortableColumn="correo">Correo <p-sortIcon field="correo"></p-sortIcon></th>
            <th pSortableColumn="telefono">Teléfono <p-sortIcon field="telefono"></p-sortIcon></th>
            <th pSortableColumn="rolNombre">Rol <p-sortIcon field="rolNombre"></p-sortIcon></th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-usuario>
          <tr>
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.apellido }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.telefono }}</td>
            <td>{{ usuario.rolNombre }}</td>
            <td>
              <p-button icon="pi pi-eye" [rounded]="true" [text]="true" (click)="verUsuario(usuario)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog Ver Usuario -->
      <p-dialog [(visible)]="displayDialog" header="Detalle de Usuario" [modal]="true" [style]="{width: '40vw'}">
        <div class="form-group">
          <label>Nombre:</label>
          <input type="text" [ngModel]="selectedUsuario.nombre" class="form-control" readonly />
        </div>
        <div class="form-group">
          <label>Apellido:</label>
          <input type="text" [ngModel]="selectedUsuario.apellido" class="form-control" readonly />
        </div>
        <div class="form-group">
          <label>Correo:</label>
          <input type="email" [ngModel]="selectedUsuario.correo" class="form-control" readonly />
        </div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input type="text" [ngModel]="selectedUsuario.telefono" class="form-control" readonly />
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input type="text" [ngModel]="selectedUsuario.direccion" class="form-control" readonly />
        </div>
        <div class="dialog-footer">
          <p-button label="Cerrar" icon="pi pi-times" (click)="displayDialog = false"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .users-admin { max-width: 1200px; padding: 1rem; }
    h2 { margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; background: #f8f9fa; }
    .dialog-footer { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
  `]
})
export class UsersAdminComponent implements OnInit, OnDestroy {
  usuarios: IUsuario[] = [];
  displayDialog = false;
  selectedUsuario: Partial<IUsuarioRequest> = {};
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void { this.loadUsuarios(); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsuarios(): void {
    this.apiService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarios: IUsuario[]) => this.usuarios = usuarios);
  }

  verUsuario(usuario: IUsuario): void {
    this.selectedUsuario = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      direccion: usuario.direccion
    };
    this.displayDialog = true;
  }
}