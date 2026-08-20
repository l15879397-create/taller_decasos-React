import React, { useState } from 'react';

export const VentasCounter: React.FC = () => {
  const [ventas, setVentas] = useState<number>(0);
  const [cajaAbierta, setCajaAbierta] = useState<boolean>(true);

  // R1: Sumar 1 venta
  const handleSumarUna = () => {
    setVentas(v => v + 1);
  };

  // R2: Sumar combo (+3) invocando la función actualizadora tres veces consecutivas
  const handleCombo3 = () => {
    setVentas(v => v + 1);
    setVentas(v => v + 1);
    setVentas(v => v + 1);
  };

  // R3: Restar 1 venta sin bajar de 0
  const handleAnularUltima = () => {
    setVentas(v => Math.max(0, v - 1));
  };

  // R4: En un mismo evento se actualizan dos estados (ventas a 0 y cajaAbierta a false)
  const handleCerrarCaja = () => {
    setVentas(0);
    setCajaAbierta(false);
  };

  // R7: Reabrir caja resetea todo al estado inicial
  const handleReabrirCaja = () => {
    setVentas(0);
    setCajaAbierta(true);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Bloque 1: Control de Caja y Ventas</h5>
        {/* R5: Badge según estado cajaAbierta */}
        <span className={`badge ${cajaAbierta ? 'bg-success' : 'bg-danger'} fs-6`}>
          {cajaAbierta ? 'Caja abierta' : 'Caja cerrada'}
        </span>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <h4 className="card-title">
            Ventas registradas: <span className="fw-bold text-primary">{ventas}</span>
          </h4>
        </div>

        {/* R6: Botones deshabilitados si la caja está cerrada */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={handleSumarUna}
            disabled={!cajaAbierta}
          >
            +1 venta
          </button>
          <button
            className="btn btn-outline-success"
            onClick={handleCombo3}
            disabled={!cajaAbierta}
          >
            Combo (+3)
          </button>
          <button
            className="btn btn-outline-warning"
            onClick={handleAnularUltima}
            disabled={!cajaAbierta}
          >
            Anular última
          </button>
          <button
            className="btn btn-danger"
            onClick={handleCerrarCaja}
            disabled={!cajaAbierta}
          >
            Cerrar caja
          </button>
          {!cajaAbierta && (
            <button className="btn btn-secondary" onClick={handleReabrirCaja}>
              Reabrir caja
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
