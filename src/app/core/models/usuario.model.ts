export interface IUsuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  rolNombre: string;
  rolId: number;
}

export interface IUsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  telefono: string;
  direccion: string;
  rolId: number;
}