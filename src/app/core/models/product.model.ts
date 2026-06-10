export interface IProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  tipoNombre: string;
  tipoId?: number; 
  categoriaId?: number;
  categoriaNombre: string;
}

