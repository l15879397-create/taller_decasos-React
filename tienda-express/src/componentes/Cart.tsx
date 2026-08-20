import React, { useState } from 'react';
import type { ItemCarrito } from '../types/tienda';

interface CartProps {
  items: ItemCarrito[];
  onIncrementar: (productoId: number) => void;
  onDecrementar: (productoId: number) => void;
  onQuitar: (productoId: number) => void;
  onVaciar: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onIncrementar,
  onDecrementar,
  onQuitar,
  onVaciar
}) => {
  // R9: Estado de envío tipado como unión literal 'listo' | 'enviando' | 'enviado'
  const [estadoEnvio, setEstadoEnvio] = useState<'listo' | 'enviando' | 'enviado'>('listo');

  // R7: Total de la venta como valor derivado con reduce (nunca en useState)
  const totalVenta = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // R8: Dos valores derivados adicionales
  const articulosDistintos = items.length;
  const unidadesTotales = items.reduce((acc, item) => acc + item.cantidad, 0);

  // R10: Manejador para enviar pedido con setTimeout de 1.5s
  const handleEnviarPedido = () => {
    if (items.length === 0) return;
    setEstadoEnvio('enviando');
    setTimeout(() => {
      setEstadoEnvio('enviado');
    }, 1500);
  };

  const isEnviando = estadoEnvio === 'enviando';

  return (
    <div className="card shadow-sm mb-4 border-info">
      <div className="card-header bg-info text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Bloque 3: Carrito de Compras</h5>
        {/* R9 Badge de estado */}
        <span
          className={`badge ${
            estadoEnvio === 'listo'
              ? 'bg-secondary'
              : estadoEnvio === 'enviando'
              ? 'bg-warning text-dark'
              : 'bg-success'
          }`}
        >
          {estadoEnvio === 'listo'
            ? 'Listo'
            : estadoEnvio === 'enviando'
            ? 'Enviando pedido...'
            : '¡Pedido enviado!'}
        </span>
      </div>
      <div className="card-body">
        {/* R8: Resumen de valores derivados */}
        <div className="row text-center mb-3 bg-light py-2 rounded">
          <div className="col-4">
            <span className="text-muted d-block small">Ítems distintos</span>
            <strong className="fs-5">{articulosDistintos}</strong>
          </div>
          <div className="col-4">
            <span className="text-muted d-block small">Unidades totales</span>
            <strong className="fs-5">{unidadesTotales}</strong>
          </div>
          <div className="col-4">
            <span className="text-muted d-block small">Total a pagar</span>
            <strong className="fs-5 text-success">
              ${totalVenta.toLocaleString('es-CO')}
            </strong>
          </div>
        </div>

                {items.length === 0 ? (
          <p className="text-muted text-center my-4">El carrito está vacío</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Regla de inmutabilidad: key siempre usa item.productoId, NUNCA el índice */}
                  {items.map(item => (
                    <tr key={item.productoId}>
                      <td className="fw-semibold">{item.nombre}</td>
                      <td>${item.precio.toLocaleString('es-CO')}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          {/* R3 & R4: Botón "-" */}
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => onDecrementar(item.productoId)}
                            disabled={isEnviando}
                          >
                            −
                          </button>
                          <span className="btn btn-light px-3 disabled fw-bold">
                            {item.cantidad}
                          </span>
                          {/* R3: Botón "+" */}
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => onIncrementar(item.productoId)}
                            disabled={isEnviando}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </td>
                      <td className="text-end">
                        {/* R5: Botón Quitar por productoId */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onQuitar(item.productoId)}
                          disabled={isEnviando}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* R6: Botón Vaciar carrito */}
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={onVaciar}
                disabled={isEnviando}
              >
                Vaciar carrito
              </button>

              <div className="d-flex gap-2 align-items-center">
                {/* R10: Botón Enviar pedido */}
                <button
                  type="button"
                  className="btn btn-success fw-bold px-4"
                  onClick={handleEnviarPedido}
                  disabled={isEnviando || items.length === 0}
                >
                  {isEnviando ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Enviando...
                    </>
                  ) : (
                    'Enviar pedido'
                  )}
                </button>

                {estadoEnvio === 'enviado' && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => setEstadoEnvio('listo')}
                  >
                    Reiniciar estado
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
