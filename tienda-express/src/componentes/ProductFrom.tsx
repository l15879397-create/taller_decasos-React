import React, { useState, useEffect } from 'react';
import type { Producto } from '../types/tienda';

interface ProductFormProps {
  productoInicial: Producto;
  onGuardar: (producto: Producto) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productoInicial, onGuardar }) => {
  const [producto, setProducto] = useState<Producto>(() => structuredClone(productoInicial));

  // Sincronizar el estado local cuando productoInicial cambia (al seleccionar otro producto)
  useEffect(() => {
    setProducto(structuredClone(productoInicial));
  }, [productoInicial]);

  // R4 & R5: Manejador genérico para campos de primer nivel, convirtiendo precio y stock a Number
  const handleChangeTopLevel = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };

  // Manejador para proveedor.nombre (segundo nivel)
  const handleChangeProveedorNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProducto(prev => ({
      ...prev,
      proveedor: {
        ...prev.proveedor,
        nombre: value
      }
    }));
  };

  // R3: Manejador con spread en los 3 niveles para proveedor.contacto (telefono, ciudad)
  const handleChangeContacto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      proveedor: {
        ...prev.proveedor,
        contacto: {
          ...prev.proveedor.contacto,
          [name]: value
        }
      }
    }));
  };

    // R6: Descartar cambios restaurando productoInicial
  const handleDescartar = () => {
    setProducto(structuredClone(productoInicial));
  };

  // Manejador al enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(producto);
  };

  // R8: Valor derivado para saber si hay cambios (nunca un useState adicional)
  const hayCambios = JSON.stringify(producto) !== JSON.stringify(productoInicial);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">Bloque 2: Formulario de Producto (ID: {producto.id})</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* R1: Nombre */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={producto.nombre}
              onChange={handleChangeTopLevel}
              required
            />
          </div>

          <div className="row mb-3">
            {/* R2: Categoria (<select>) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Categoría</label>
              <select
                name="categoria"
                className="form-select"
                value={producto.categoria}
                onChange={handleChangeTopLevel}
              >
                <option value="abarrotes">abarrotes</option>
                <option value="aseo">aseo</option>
                <option value="bebidas">bebidas</option>
              </select>
            </div>

            {/* R1 & R5: Precio (Number) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Precio ($)</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                value={producto.precio}
                onChange={handleChangeTopLevel}
                min="0"
                step="50"
                required
              />
            </div>

            {/* R1 & R5: Stock (Number) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={producto.stock}
                onChange={handleChangeTopLevel}
                min="0"
                required
              />
            </div>
          </div>

          <hr />
          <h6>Datos del Proveedor</h6>

          {/* R3: proveedor.nombre */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre Proveedor</label>
            <input
              type="text"
              className="form-control"
              value={producto.proveedor.nombre}
              onChange={handleChangeProveedorNombre}
              required
            />
          </div>

          <div className="row mb-3">
            {/* R3: proveedor.contacto.telefono */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Teléfono Contacto</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={producto.proveedor.contacto.telefono}
                onChange={handleChangeContacto}
                required
              />
            </div>

            {/* R3: proveedor.contacto.ciudad */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Ciudad Contacto</label>
              <input
                type="text"
                name="ciudad"
                className="form-control"
                value={producto.proveedor.contacto.ciudad}
                onChange={handleChangeContacto}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            {/* R8: Guardar deshabilitado si !hayCambios */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!hayCambios}
            >
              Guardar Cambios
            </button>

            {/* R6: Descartar cambios */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleDescartar}
              disabled={!hayCambios}
            >
              Descartar cambios
            </button>
          </div>
        </form>

        {/* R7: pre visualizando estado en tiempo real */}
        <div className="mt-3">
          <label className="form-label text-muted small fw-bold">
            Estado interno en tiempo real (JSON.stringify):
          </label>
          <pre className="bg-light p-3 rounded border fs-7 text-dark overflow-auto" style={{ maxHeight: '200px' }}>
            {JSON.stringify(producto, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

