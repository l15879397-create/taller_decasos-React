import { useState, useEffect } from 'react';
import type { Producto, ItemCarrito } from './types/tienda';
import { useProducts } from './hooks/ProductDetail';
import { useToggle } from './hooks/useToggle';
import { VentasCounter } from './componentes/VentasCounter';
import { ProductList } from './componentes/ProductList';
import { ProductDetail } from './componentes/ProductDeail';
import { Cart } from './componentes/Cart';

export function App() {
  // R4/R5: Estado de término de búsqueda que alimenta useProducts
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  // R1 & R3: Hook useProducts para cargar productos y refetch para reintento
  const { productos: productosApi, cargando, error, refetch } = useProducts(terminoBusqueda);

  // R8: Estado local para productos editables, sincronizado desde useProducts
  const [productosLocal, setProductosLocal] = useState<Producto[]>([]);

  // R6: ID del producto seleccionado (Principios de estructuración: No duplicación de objetos)
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);

  // R9: Estado elevado del carrito de compras (items)
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);

  // R11: Visibilidad del carrito usando el hook personalizado useToggle
  const [mostrarCarrito, toggleMostrarCarrito] = useToggle(true);

  // Sincronizar catálogo local con las respuestas del hook API preservando ediciones locales
  useEffect(() => {
    if (productosApi.length > 0) {
      setProductosLocal(prev => {
        return productosApi.map(apiProd => {
          const editado = prev.find(p => p.id === apiProd.id);
          return editado || apiProd;
        });
      });
    } else {
      setProductosLocal([]);
    }
  }, [productosApi]);

  // R7: Valor derivado para el producto seleccionado (nunca useState duplicado)
  const productoSeleccionado =
    productosLocal.find(p => p.id === seleccionadoId) || null;

  // R10: Sincronizar document.title según las unidades del carrito
  const unidadesTotalesCarrito = itemsCarrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  useEffect(() => {
    document.title =
      unidadesTotalesCarrito > 0
        ? `(${unidadesTotalesCarrito}) TiendaExpress`
        : 'TiendaExpress';
  }, [unidadesTotalesCarrito]);

  // R8: Guardar producto editado de forma inmutable (map + spread)
  const handleGuardarProducto = (productoEditado: Producto) => {
    setProductosLocal(prev =>
      prev.map(p => (p.id === productoEditado.id ? productoEditado : p))
    );
  };

  // R9, R1 & R2 (Cart): Agregar producto al carrito inmutablemente
  const handleAgregarAlCarrito = (producto: Producto) => {
    setItemsCarrito(prev => {
      const existe = prev.find(item => item.productoId === producto.id);
      if (existe) {
        return prev.map(item =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1
        }
      ];
    });
  };

  // Cart Handlers (Bloque 3)
  const handleIncrementar = (productoId: number) => {
    setItemsCarrito(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const handleDecrementar = (productoId: number) => {
    setItemsCarrito(prev =>
      prev
        .map(item =>
          item.productoId === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const handleQuitar = (productoId: number) => {
    setItemsCarrito(prev => prev.filter(item => item.productoId !== productoId));
  };

  const handleVaciar = () => {
    setItemsCarrito([]);
  };

  return (
    <div className="container py-4">
      {/* Encabezado Principal */}
      <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-3 text-primary fw-bold">🏪 TiendaExpress</span>
          <span className="badge bg-secondary">ADSO - SENA</span>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {/* R11: Botón Mostrar/Ocultar carrito con useToggle */}
          <button
            className={`btn ${mostrarCarrito ? 'btn-outline-info' : 'btn-info'}`}
            onClick={toggleMostrarCarrito}
          >
            {mostrarCarrito ? '👁️ Ocultar carrito' : '🛒 Mostrar carrito'}
          </button>
        </div>
      </header>

      {/* Bloque 1: Componente VentasCounter */}
      <VentasCounter />

      {/* Bar de búsqueda */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label htmlFor="busqueda" className="form-label fw-bold">
            🔍 Buscar productos por nombre (Prueba escribiendo "error" para simular fallo):
          </label>
          <div className="input-group">
            <input
              id="busqueda"
              type="text"
              className="form-control form-control-lg"
              placeholder="Ej. Arroz, Aceite, Detergente, Jugo..."
              value={terminoBusqueda}
              onChange={e => setTerminoBusqueda(e.target.value)}
            />
            {terminoBusqueda && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setTerminoBusqueda('')}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* R2: Mensaje e indicador de carga */}
      {cargando && (
        <div className="alert alert-info d-flex align-items-center gap-2 mb-4">
          <div className="spinner-border spinner-border-sm text-info" role="status"></div>
          <span>Cargando productos...</span>
        </div>
      )}

      {/* R3: Alerta de Error con Botón Reintentar */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-4">
          <div>
            <strong>Error de conexión:</strong> {error}
          </div>
          <button className="btn btn-danger btn-sm px-3" onClick={refetch}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Disposición en 2 Columnas */}
      <div className="row">
        {/* Columna Izquierda: Lista de Productos (Bloque 4 R6/R7) */}
        <div className={mostrarCarrito ? 'col-lg-6' : 'col-lg-12'}>
          <ProductList
            productos={productosLocal}
            seleccionadoId={seleccionadoId}
            onSeleccionar={id => setSeleccionadoId(id)}
            cargando={cargando}
          />
        </div>

        {/* Columna Derecha: Detalle del Producto & Carrito */}
        {mostrarCarrito && (
          <div className="col-lg-6">
            {/* Detalle y Edición del Producto Seleccionado */}
            <ProductDetail
              producto={productoSeleccionado}
              onGuardarProducto={handleGuardarProducto}
              onAgregarAlCarrito={handleAgregarAlCarrito}
            />

            {/* Carrito de Compras (Bloque 3) */}
            <Cart
              items={itemsCarrito}
              onIncrementar={handleIncrementar}
              onDecrementar={handleDecrementar}
              onQuitar={handleQuitar}
              onVaciar={handleVaciar}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
