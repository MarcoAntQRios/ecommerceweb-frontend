import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
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
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css']
})
export class UsersAdminComponent implements OnInit, OnDestroy {
  usuarios: IUsuario[] = [];
  displayDialog = false;
  selectedUsuario: Partial<IUsuarioRequest> = {};
  private destroy$ = new Subject<void>();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarios: IUsuario[]) => (this.usuarios = usuarios));
  }

  verUsuario(usuario: IUsuario): void {
    this.selectedUsuario = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
    };
    this.displayDialog = true;
  }
}