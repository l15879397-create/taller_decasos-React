import React from 'react';
import type { Producto } from '../types/tienda';

interface ProductListProps {
  productos: Producto[];
  seleccionadoId: number | null;
  onSeleccionar: (id: number) => void;
  cargando: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  productos,
  seleccionadoId,
  onSeleccionar,
  cargando
}) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Catálogo de Productos</h5>
        <span className="badge bg-light text-dark">
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>
      <div className="card-body p-0">
        {cargando && productos.length === 0 ? (
          <div className="p-4 text-center text-muted">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="p-4 text-center text-muted">
            No se encontraron productos coincidentes.
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {productos.map(p => {
              const esSeleccionado = p.id === seleccionadoId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSeleccionar(p.id)}
                  disabled={cargando}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 ${
                    esSeleccionado ? 'active fw-bold' : ''
                  }`}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-6">{p.nombre}</span>
                      <span
                        className={`badge ${
                          esSeleccionado ? 'bg-light text-dark' : 'bg-secondary'
                        } text-capitalize`}
                      >
                        {p.categoria}
                      </span>
                    </div>
                    <small className={esSeleccionado ? 'text-light' : 'text-muted'}>
                      Stock: {p.stock} | Proveedor: {p.proveedor.nombre} ({p.proveedor.contacto.ciudad})
                    </small>
                  </div>
                  <span className={`fs-5 fw-bold ${esSeleccionado ? 'text-white' : 'text-primary'}`}>
                    ${p.precio.toLocaleString('es-CO')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
