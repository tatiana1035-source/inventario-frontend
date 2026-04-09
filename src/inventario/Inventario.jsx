/**
 * @file Inventario.jsx
 * @description Módulo principal de gestión de inventario.
 *              Permite listar, buscar, filtrar, agregar, editar
 *              y eliminar productos del inventario.
 * @module Inventario
 */

import { useState, useEffect, useCallback } from "react";

// ─── Datos de ejemplo (reemplazar por llamadas a API real) ─────────────────────
const PRODUCTOS_INICIALES = [
  {
    id: 1,
    codigo: "PROD-001",
    nombre: "Queso crema * 2k",
    categoria: "Refrigerado",
    proveedor: "el galan",
    stock: 12,
    stockMinimo: 5,
    precio: 28500,
    ubicacion: "Cava refrigeración – Segundo piso",
    estado: "activo",
  },
  {
    id: 2,
    codigo: "PROD-002",
    nombre: "Salsa de piña * 1000 g",
    categoria: "Abarrotes",
    proveedor: "Aderezos",
    stock: 3,
    stockMinimo: 10,
    precio: 8500,
    ubicacion: "Bodega  – Estante 4",
    estado: "activo",
  },
  {
    id: 3,
    codigo: "PROD-003",
    nombre: "Salsa de carnes * 210 g",
    categoria: "Abarrotes",
    proveedor: "Aderezos",
    stock: 8,
    stockMinimo: 5,
    precio: 7200,
    ubicacion: "Bodega – Estante 2",
    estado: "activo",
  },
  {
    id: 4,
    codigo: "PROD-004",
    nombre: 'Carne de hamburguesa *2700 g"',
    categoria: "Congelados",
    proveedor: "Zenu",
    stock: 0,
    stockMinimo: 3,
    precio: 38000,
    ubicacion: "Cava congelación – Estante 5",
    estado: "inactivo",
  },
  {
    id: 5,
    codigo: "PROD-005",
    nombre: "Contenedor 12 onzas",
    categoria: "Abarrotes",
    proveedor: "Darnel",
    stock: 6,
    stockMinimo: 2,
    precio: 9500,
    ubicacion: "Bodega – Estante 12",
    estado: "activo",
  },
];

// ─── Categorías disponibles ────────────────────────────────────────────────────
const CATEGORIAS = ["Todas", "Congelados", "Abarrotes", "Desechables", "Refrigerados", "Otros"];

// ─── Estado inicial del formulario ────────────────────────────────────────────
const FORM_INICIAL = {
  codigo: "",
  nombre: "",
  categoria: "Electrónica",
  proveedor: "",
  stock: "",
  stockMinimo: "",
  precio: "",
  ubicacion: "",
  estado: "activo",
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Determina el estado visual del stock de un producto.
 * @param {number} stock - Cantidad actual en inventario.
 * @param {number} stockMinimo - Umbral mínimo de alerta.
 * @returns {{ label: string, color: string }}
 */
const getEstadoStock = (stock, stockMinimo) => {
  if (stock === 0) return { label: "Agotado", color: "#E24B4A" };
  if (stock <= stockMinimo) return { label: "Bajo", color: "#EF9F27" };
  return { label: "Disponible", color: "#639922" };
};

/**
 * Formatea un número como moneda colombiana (COP).
 * @param {number} valor
 * @returns {string}
 */
const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Inventario — Módulo de gestión de productos en inventario.
 * Implementa CRUD completo con búsqueda, filtros y alertas de stock.
 */
const Inventario = () => {
  // ── Estado ────────────────────────────────────────────────────────────────
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState({ campo: "nombre", asc: true });

  // ── Filtrado y ordenamiento ───────────────────────────────────────────────

  /**
   * Filtra los productos según búsqueda y categoría seleccionada.
   */
  const productosFiltrados = useCallback(() => {
    return productos
      .filter((p) => {
        const coincideBusqueda =
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.proveedor.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
        return coincideBusqueda && coincideCategoria;
      })
      .sort((a, b) => {
        const { campo, asc } = ordenColumna;
        const va = typeof a[campo] === "string" ? a[campo].toLowerCase() : a[campo];
        const vb = typeof b[campo] === "string" ? b[campo].toLowerCase() : b[campo];
        if (va < vb) return asc ? -1 : 1;
        if (va > vb) return asc ? 1 : -1;
        return 0;
      });
  }, [productos, busqueda, categoriaFiltro, ordenColumna]);

  // ── Métricas del panel superior ───────────────────────────────────────────
  const totalProductos = productos.length;
  const productosActivos = productos.filter((p) => p.estado === "activo").length;
  const productosAgotados = productos.filter((p) => p.stock === 0).length;
  const productosBajoStock = productos.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo).length;

  // ── Validación del formulario ─────────────────────────────────────────────

  /**
   * Valida los campos obligatorios del formulario de producto.
   * @returns {boolean} true si el formulario es válido.
   */
  const validarFormulario = () => {
    const e = {};
    if (!productoActual.codigo.trim()) e.codigo = "El código es obligatorio.";
    if (!productoActual.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!productoActual.proveedor.trim()) e.proveedor = "El proveedor es obligatorio.";
    if (productoActual.stock === "" || Number(productoActual.stock) < 0)
      e.stock = "Ingrese una cantidad válida (≥ 0).";
    if (productoActual.stockMinimo === "" || Number(productoActual.stockMinimo) < 0)
      e.stockMinimo = "Ingrese un mínimo válido (≥ 0).";
    if (productoActual.precio === "" || Number(productoActual.precio) <= 0)
      e.precio = "Ingrese un precio mayor a 0.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // ── Acciones CRUD ─────────────────────────────────────────────────────────

  /** Abre el modal para crear un nuevo producto. */
  const abrirCrear = () => {
    setProductoActual(FORM_INICIAL);
    setErrores({});
    setModoEdicion(false);
    setModalAbierto(true);
  };

  /**
   * Abre el modal pre-cargado con los datos del producto a editar.
   * @param {object} producto
   */
  const abrirEditar = (producto) => {
    setProductoActual({ ...producto });
    setErrores({});
    setModoEdicion(true);
    setModalAbierto(true);
  };

  /** Guarda el producto (crear o actualizar). */
  const guardarProducto = () => {
    if (!validarFormulario()) return;

    const datos = {
      ...productoActual,
      stock: Number(productoActual.stock),
      stockMinimo: Number(productoActual.stockMinimo),
      precio: Number(productoActual.precio),
    };

    if (modoEdicion) {
      // Actualizar producto existente
      setProductos((prev) => prev.map((p) => (p.id === datos.id ? datos : p)));
    } else {
      // Crear nuevo producto con ID incremental
      const nuevoId = Math.max(...productos.map((p) => p.id), 0) + 1;
      setProductos((prev) => [...prev, { ...datos, id: nuevoId }]);
    }

    setModalAbierto(false);
  };

  /**
   * Elimina un producto por ID.
   * @param {number} id
   */
  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setConfirmEliminar(null);
    if (vistaDetalle?.id === id) setVistaDetalle(null);
  };

  /** Actualiza el campo del formulario actual. */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoActual((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo al modificarlo
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  /** Cambia el campo de ordenamiento o invierte la dirección. */
  const handleOrden = (campo) => {
    setOrdenColumna((prev) =>
      prev.campo === campo ? { campo, asc: !prev.asc } : { campo, asc: true }
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", color: "#1a1a1a" }}>

      {/* ── Encabezado ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Inventario</h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#666" }}>
            Gestión de productos y existencias
          </p>
        </div>
        <button
          onClick={abrirCrear}
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.25rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          + Nuevo producto
        </button>
      </div>

      {/* ── Tarjetas KPI ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { label: "Total productos", valor: totalProductos, color: "#2563EB" },
          { label: "Activos", valor: productosActivos, color: "#639922" },
          { label: "Bajo stock", valor: productosBajoStock, color: "#EF9F27" },
          { label: "Agotados", valor: productosAgotados, color: "#E24B4A" },
        ].map(({ label, valor, color }) => (
          <div
            key={label}
            style={{
              background: "#f9f9f9",
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "1rem",
              borderTop: `4px solid ${color}`,
            }}
          >
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontWeight: 700, color }}>{valor}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de búsqueda y filtro ──────────────────────────────────── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, código o proveedor…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: "1 1 240px",
            padding: "0.5rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "0.875rem",
          }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "0.875rem",
            background: "#fff",
          }}
        >
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Tabla de productos ──────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", border: "1px solid #e5e5e5", borderRadius: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {[
                { campo: "codigo", label: "Código" },
                { campo: "nombre", label: "Nombre" },
                { campo: "categoria", label: "Categoría" },
                { campo: "stock", label: "Stock" },
                { campo: "precio", label: "Precio" },
                { campo: "estado", label: "Estado" },
              ].map(({ campo, label }) => (
                <th
                  key={campo}
                  onClick={() => handleOrden(campo)}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 600,
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  {label}
                  {ordenColumna.campo === campo && (
                    <span style={{ marginLeft: 4, fontSize: "0.7rem" }}>
                      {ordenColumna.asc ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
              <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e5e5" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados().length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              productosFiltrados().map((producto, idx) => {
                const estadoStock = getEstadoStock(producto.stock, producto.stockMinimo);
                return (
                  <tr
                    key={producto.id}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", color: "#555" }}>
                      {producto.codigo}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>
                      {producto.nombre}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#555" }}>
                      {producto.categoria}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: estadoStock.color,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {producto.stock}
                        <span
                          style={{
                            fontSize: "0.7rem",
                            background: estadoStock.color + "22",
                            color: estadoStock.color,
                            borderRadius: 4,
                            padding: "1px 6px",
                          }}
                        >
                          {estadoStock.label}
                        </span>
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>{formatCOP(producto.precio)}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 10px",
                          borderRadius: 12,
                          background: producto.estado === "activo" ? "#dcfce7" : "#fee2e2",
                          color: producto.estado === "activo" ? "#166534" : "#991b1b",
                          fontWeight: 500,
                        }}
                      >
                        {producto.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {/* Ver detalle */}
                        <button
                          onClick={() => setVistaDetalle(producto)}
                          title="Ver detalle"
                          style={btnEstilo("#2563EB")}
                        >
                          Ver
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => abrirEditar(producto)}
                          title="Editar"
                          style={btnEstilo("#059669")}
                        >
                          Editar
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => setConfirmEliminar(producto)}
                          title="Eliminar"
                          style={btnEstilo("#DC2626")}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pie de tabla ────────────────────────────────────────────────── */}
      <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
        Mostrando {productosFiltrados().length} de {totalProductos} producto(s).
      </p>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Crear / Editar producto
      ═══════════════════════════════════════════════════════════════════ */}
      {modalAbierto && (
        <div style={overlayEstilo}>
          <div style={modalEstilo}>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.125rem", fontWeight: 600 }}>
              {modoEdicion ? "Editar producto" : "Nuevo producto"}
            </h2>

            {/* Formulario */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Código */}
              <Campo label="Código *" error={errores.codigo}>
                <input name="codigo" value={productoActual.codigo} onChange={handleChange} style={inputEstilo(errores.codigo)} placeholder="PROD-XXX" />
              </Campo>

              {/* Nombre */}
              <Campo label="Nombre *" error={errores.nombre}>
                <input name="nombre" value={productoActual.nombre} onChange={handleChange} style={inputEstilo(errores.nombre)} placeholder="Nombre del producto" />
              </Campo>

              {/* Categoría */}
              <Campo label="Categoría">
                <select name="categoria" value={productoActual.categoria} onChange={handleChange} style={inputEstilo()}>
                  {CATEGORIAS.filter((c) => c !== "Todas").map((c) => <option key={c}>{c}</option>)}
                </select>
              </Campo>

              {/* Proveedor */}
              <Campo label="Proveedor *" error={errores.proveedor}>
                <input name="proveedor" value={productoActual.proveedor} onChange={handleChange} style={inputEstilo(errores.proveedor)} placeholder="Nombre del proveedor" />
              </Campo>

              {/* Stock */}
              <Campo label="Stock actual *" error={errores.stock}>
                <input type="number" name="stock" value={productoActual.stock} onChange={handleChange} style={inputEstilo(errores.stock)} min={0} />
              </Campo>

              {/* Stock mínimo */}
              <Campo label="Stock mínimo *" error={errores.stockMinimo}>
                <input type="number" name="stockMinimo" value={productoActual.stockMinimo} onChange={handleChange} style={inputEstilo(errores.stockMinimo)} min={0} />
              </Campo>

              {/* Precio */}
              <Campo label="Precio (COP) *" error={errores.precio}>
                <input type="number" name="precio" value={productoActual.precio} onChange={handleChange} style={inputEstilo(errores.precio)} min={1} />
              </Campo>

              {/* Ubicación */}
              <Campo label="Ubicación">
                <input name="ubicacion" value={productoActual.ubicacion} onChange={handleChange} style={inputEstilo()} placeholder="Bodega – Estante" />
              </Campo>

              {/* Estado */}
              <Campo label="Estado">
                <select name="estado" value={productoActual.estado} onChange={handleChange} style={inputEstilo()}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </Campo>
            </div>

            {/* Botones del modal */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "1.5rem" }}>
              <button onClick={() => setModalAbierto(false)} style={btnEstilo("#6b7280")}>Cancelar</button>
              <button onClick={guardarProducto} style={btnEstilo("#2563EB")}>
                {modoEdicion ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Confirmación de eliminación
      ═══════════════════════════════════════════════════════════════════ */}
      {confirmEliminar && (
        <div style={overlayEstilo}>
          <div style={{ ...modalEstilo, maxWidth: 400 }}>
            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.125rem", color: "#DC2626" }}>Eliminar producto</h2>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.9rem", color: "#555" }}>
              ¿Está seguro de eliminar <strong>{confirmEliminar.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setConfirmEliminar(null)} style={btnEstilo("#6b7280")}>Cancelar</button>
              <button onClick={() => eliminarProducto(confirmEliminar.id)} style={btnEstilo("#DC2626")}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PANEL: Detalle del producto (lateral)
      ═══════════════════════════════════════════════════════════════════ */}
      {vistaDetalle && (
        <div
          style={{
            position: "fixed", top: 0, right: 0, height: "100%", width: "360px",
            background: "#fff", boxShadow: "-4px 0 16px rgba(0,0,0,0.12)",
            padding: "1.5rem", overflowY: "auto", zIndex: 200,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Detalle del producto</h2>
            <button onClick={() => setVistaDetalle(null)} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#555" }}>✕</button>
          </div>

          {/* Indicador visual de estado de stock */}
          {(() => {
            const est = getEstadoStock(vistaDetalle.stock, vistaDetalle.stockMinimo);
            return (
              <div
                style={{
                  background: est.color + "15",
                  border: `1px solid ${est.color}55`,
                  borderRadius: 8,
                  padding: "0.75rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: "1.5rem", color: est.color, fontWeight: 700 }}>{vistaDetalle.stock}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: est.color }}>{est.label}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#555" }}>
                    Mínimo: {vistaDetalle.stockMinimo} unidades
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Campos del detalle */}
          {[
            ["Código", vistaDetalle.codigo],
            ["Nombre", vistaDetalle.nombre],
            ["Categoría", vistaDetalle.categoria],
            ["Proveedor", vistaDetalle.proveedor],
            ["Precio", formatCOP(vistaDetalle.precio)],
            ["Ubicación", vistaDetalle.ubicacion || "—"],
            ["Estado", vistaDetalle.estado === "activo" ? "Activo" : "Inactivo"],
          ].map(([clave, valor]) => (
            <div key={clave} style={{ marginBottom: "0.75rem" }}>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>{clave}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.95rem", fontWeight: 500 }}>{valor}</p>
            </div>
          ))}

          {/* Acciones rápidas desde el panel */}
          <div style={{ display: "flex", gap: 8, marginTop: "1.5rem" }}>
            <button onClick={() => { abrirEditar(vistaDetalle); setVistaDetalle(null); }} style={{ ...btnEstilo("#2563EB"), flex: 1 }}>
              Editar
            </button>
            <button onClick={() => setConfirmEliminar(vistaDetalle)} style={{ ...btnEstilo("#DC2626"), flex: 1 }}>
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Estilos reutilizables ─────────────────────────────────────────────────────

/**
 * Estilos base de un botón de acción con color de fondo configurable.
 * @param {string} bg - Color de fondo en hex.
 */
const btnEstilo = (bg) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "5px 12px",
  fontSize: "0.8rem",
  fontWeight: 500,
  cursor: "pointer",
});

/** Estilos del overlay oscuro para modales. */
const overlayEstilo = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100,
};

/** Estilos del contenedor de modal. */
const modalEstilo = {
  background: "#fff",
  borderRadius: 12,
  padding: "1.5rem",
  width: "100%",
  maxWidth: 620,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
};

/**
 * Estilos de un input, con borde rojo si hay error.
 * @param {string} [error]
 */
const inputEstilo = (error) => ({
  width: "100%",
  padding: "0.4rem 0.6rem",
  border: `1px solid ${error ? "#DC2626" : "#d1d5db"}`,
  borderRadius: 6,
  fontSize: "0.875rem",
  boxSizing: "border-box",
});

// ─── Sub-componente: Campo de formulario ───────────────────────────────────────

/**
 * Campo — Wrapper de etiqueta + input + mensaje de error.
 * @param {{ label: string, error?: string, children: React.ReactNode }} props
 */
const Campo = ({ label, error, children }) => (
  <div>
    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: 4, color: "#374151" }}>
      {label}
    </label>
    {children}
    {error && <p style={{ margin: "3px 0 0", fontSize: "0.75rem", color: "#DC2626" }}>{error}</p>}
  </div>
);

export default Inventario;