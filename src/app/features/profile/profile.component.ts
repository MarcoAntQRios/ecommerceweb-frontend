import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { IUsuario, IUsuarioRequest } from '../../core/models/usuario.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    DividerModule,
    TagModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario = signal<IUsuario | null>(null);
  editMode = signal(false);
  loading = signal(false);
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nombre:    ['', [Validators.required, Validators.minLength(2)]],
      apellido:  ['', [Validators.required, Validators.minLength(2)]],
      correo:    ['', [Validators.required, Validators.email]],
      telefono:  ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      password:  [''],  // opcional al actualizar
    });
  }

  private loadProfile(): void {
    const user = this.authService.currentUser();
    if (!user?.sub) {
      this.router.navigate(['/login']);
      return;
    }
    this.loading.set(true);
    this.usuarioService.getUsuarioById(Number(user.sub)).subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.profileForm.patchValue({
          nombre:    data.nombre,
          apellido:  data.apellido,
          correo:    data.correo,
          telefono:  data.telefono,
          direccion: data.direccion,
        });
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el perfil.' });
        this.loading.set(false);
      }
    });
  }

  enableEdit(): void  { this.editMode.set(true); }

  cancelEdit(): void {
    this.editMode.set(false);
    const u = this.usuario();
    if (u) {
      this.profileForm.patchValue({
        nombre: u.nombre, apellido: u.apellido,
        correo: u.correo, telefono: u.telefono,
        direccion: u.direccion, password: '',
      });
    }
  }

  saveChanges(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    const u = this.usuario();
    if (!u) return;

    const f = this.profileForm.value;
  const request: IUsuarioRequest = {
  nombre: f.nombre,
  apellido: f.apellido,
  correo: f.correo,
  telefono: f.telefono,
  direccion: f.direccion,
  rolId: u.rolId
};

    this.loading.set(true);
    this.usuarioService.updateUsuario(u.id, request).subscribe({
      next: (updated) => {
        this.usuario.set(updated);
        this.editMode.set(false);
        this.loading.set(false);
        this.profileForm.patchValue({ password: '' });
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Datos actualizados correctamente.' });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los cambios.' });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const c = this.profileForm.get(field);
    return !!(c?.invalid && c?.touched);
  }
}