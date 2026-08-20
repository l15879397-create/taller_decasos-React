import React from 'react';
import type { Producto } from '../types/tienda';
import { ProductForm } from './ProductFrom';

interface ProductDetailProps {
  producto: Producto | null;
  onGuardarProducto: (producto: Producto) => void;
  onAgregarAlCarrito: (producto: Producto) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  producto,
  onGuardarProducto,
  onAgregarAlCarrito
}) => {
  if (!producto) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-5 text-muted">
          <i className="bi bi-cursor fs-1 d-block mb-2"></i>
          <h5>Ningún producto seleccionado</h5>
          <p className="mb-0">
            Haz clic en un producto de la lista del catálogo para inspeccionar su detalle, editarlo o agregarlo al carrito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Botón de elevación de estado al carrito (R9 de Bloque 4) */}
      <div className="card shadow-sm mb-3 border-primary">
        <div className="card-body d-flex justify-content-between align-items-center bg-light">
          <div>
            <h5 className="mb-0 fw-bold">{producto.nombre}</h5>
            <span className="text-muted">
              Precio: ${producto.precio.toLocaleString('es-CO')} | Stock disponible: {producto.stock}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-success btn-lg fw-bold"
            onClick={() => onAgregarAlCarrito(producto)}
          >
            + Agregar a la venta
          </button>
        </div>
      </div>

      {/* Bloque 2: Formulario de edición del producto */}
      <ProductForm
        key={producto.id}
        productoInicial={producto}
        onGuardar={onGuardarProducto}
      />
    </div>
  );
};
