export interface IDetalleVenta {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface IVenta {
  id: number;
  usuarioNombre: string;
  fecha: string;
  total: number;
  estado: string;
  detalleVenta: IDetalleVenta[];
}

export interface IDetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface IVentaRequest {
  usuarioId: number;
  detalles: IDetalleVentaRequest[];
}