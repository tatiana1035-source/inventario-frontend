/**
 * Dashboard.jsx
 * Panel principal del sistema de inventario StockLogistic.
 * Muestra KPIs, alertas activas, últimos movimientos y accesos rápidos.
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     2.0.0
 */

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/** Datos simulados — en producción vendrían de la API */
const kpis = [
  { etiqueta: 'Total productos',    valor: 120, icono: '📦', color: '#ebf4ff', texto: '#2b6cb0' },
  { etiqueta: 'Stock crítico',      valor: 8,   icono: '⚠️', color: '#fff5f5', texto: '#c53030' },
  { etiqueta: 'Alertas activas',    valor: 5,   icono: '🔔', color: '#fffaf0', texto: '#c05621' },
  { etiqueta: 'Usuarios activos',   valor: 8,   icono: '👥', color: '#f0fff4', texto: '#276749' },
];

const alertasRecientes = [
  { id: 1, producto: 'Salsa teriyaki aderezo * 210',     mensaje: 'Stock por debajo del mínimo (3 uds)', tipo: 'critico' },
  { id: 2, producto: 'Carne de hamburguesa toto *900 g',   mensaje: 'Stock bajo (15 uds)',               tipo: 'advertencia' },
  { id: 3, producto: 'Aceite de oliva * 1000 g',   mensaje: 'Sin movimiento hace 30 días',          tipo: 'info' },
];

const ultimosMovimientos = [
  { id: 1, tipo: 'Entrada', producto: 'Salsa teriyaki aderezo * 210', cantidad: 20,  fecha: '08/04/2026' },
  { id: 2, tipo: 'Salida',  producto: 'contenedor 12 onzas',  cantidad: 15,  fecha: '07/04/2026' },
  { id: 3, tipo: 'Entrada', producto: 'Aceite de oliva * 1000 g',  cantidad: 30,  fecha: '06/04/2026' },
  { id: 4, tipo: 'Salida',  producto: 'Carne de hamburguesa toto *900 g',  cantidad: 200, fecha: '05/04/2026' },
];

const accesosRapidos = [
  { etiqueta: 'Registrar entrada/salida', icono: '🔄', ruta: '/movimientos' },
  { etiqueta: 'Buscar producto',          icono: '🔍', ruta: '/buscar' },
  { etiqueta: 'Ver reportes',             icono: '📈', ruta: '/reportes' },
  { etiqueta: 'Inventario por categoría', icono: '📋', ruta: '/inventario' },
];

function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={estilos.pagina}>

      {/* ── Encabezado ── */}
      <header style={estilos.encabezado}>
        <div>
          <h1 style={estilos.titulo}>
            Bienvenido, {usuario?.nombre || 'Usuario'} 👋
          </h1>
          <p style={estilos.subtitulo}>
            Resumen del sistema de gestión de inventario — StockLogic
          </p>
        </div>
        <span style={estilos.fecha}>
          {new Date().toLocaleDateString('es-CO', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric',
          })}
        </span>
      </header>

      {/* ── KPIs ── */}
      <section style={estilos.seccion}>
        <h2 style={estilos.seccionTitulo}>Indicadores clave</h2>
        <div style={estilos.kpiGrid}>
          {kpis.map((kpi) => (
            <div key={kpi.etiqueta}
              style={{ ...estilos.kpiTarjeta, backgroundColor: kpi.color }}>
              <span style={estilos.kpiIcono}>{kpi.icono}</span>
              <p style={{ ...estilos.kpiValor, color: kpi.texto }}>{kpi.valor}</p>
              <p style={estilos.kpiEtiqueta}>{kpi.etiqueta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Alertas + Movimientos ── */}
      <section style={estilos.dobleColumna}>

        {/* Alertas recientes */}
        <div style={estilos.panel}>
          <h2 style={estilos.panelTitulo}>🔔 Alertas recientes</h2>
          {alertasRecientes.map((alerta) => (
            <div key={alerta.id}
              style={{
                ...estilos.alertaItem,
                borderLeftColor:
                  alerta.tipo === 'critico' ? '#e53e3e' :
                  alerta.tipo === 'advertencia' ? '#dd6b20' : '#3182ce',
              }}>
              <p style={estilos.alertaProducto}>{alerta.producto}</p>
              <p style={estilos.alertaMensaje}>{alerta.mensaje}</p>
            </div>
          ))}
        </div>

        {/* Últimos movimientos */}
        <div style={estilos.panel}>
          <h2 style={estilos.panelTitulo}>🔄 Últimos movimientos</h2>
          <table style={estilos.tabla}>
            <thead>
              <tr>
                {['Tipo', 'Producto', 'Cant.', 'Fecha'].map((col) => (
                  <th key={col} style={estilos.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ultimosMovimientos.map((mov) => (
                <tr key={mov.id}>
                  <td style={estilos.td}>
                    <span style={{
                      ...estilos.badgeTipo,
                      backgroundColor: mov.tipo === 'Entrada' ? '#f0fff4' : '#fff5f5',
                      color: mov.tipo === 'Entrada' ? '#276749' : '#c53030',
                    }}>
                      {mov.tipo}
                    </span>
                  </td>
                  <td style={estilos.td}>{mov.producto}</td>
                  <td style={estilos.td}>{mov.cantidad}</td>
                  <td style={estilos.td}>{mov.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* ── Accesos rápidos ── */}
      <section style={estilos.seccion}>
        <h2 style={estilos.seccionTitulo}>Accesos rápidos</h2>
        <div style={estilos.accesosGrid}>
          {accesosRapidos.map((acc) => (
            <button
              key={acc.ruta}
              style={estilos.accesoBoton}
              onClick={() => navigate(acc.ruta)}
            >
              <span style={estilos.accesoIcono}>{acc.icono}</span>
              <span>{acc.etiqueta}</span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}

const estilos = {
  pagina: { padding: '2rem', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' },
  titulo: { fontSize: '1.5rem', fontWeight: '700', color: '#2d3748', margin: 0 },
  subtitulo: { color: '#718096', fontSize: '0.9rem', margin: '0.25rem 0 0' },
  fecha: { fontSize: '0.85rem', color: '#718096', textTransform: 'capitalize' },
  seccion: { marginBottom: '2rem' },
  seccionTitulo: { fontSize: '1rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.75rem' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  kpiTarjeta: { borderRadius: '12px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  kpiIcono: { fontSize: '1.5rem' },
  kpiValor: { fontSize: '2rem', fontWeight: '700', margin: '0.25rem 0' },
  kpiEtiqueta: { fontSize: '0.8rem', color: '#718096', margin: 0 },
  dobleColumna: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' },
  panel: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  panelTitulo: { fontSize: '0.95rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' },
  alertaItem: { borderLeft: '4px solid', paddingLeft: '0.75rem', marginBottom: '0.75rem', borderRadius: '0 4px 4px 0' },
  alertaProducto: { fontSize: '0.875rem', fontWeight: '600', color: '#2d3748', margin: 0 },
  alertaMensaje: { fontSize: '0.8rem', color: '#718096', margin: '0.15rem 0 0' },
  tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '0.5rem', color: '#718096', fontWeight: '600', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.5rem', color: '#4a5568', borderBottom: '1px solid #f7fafc' },
  badgeTipo: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  accesosGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  accesoBoton: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem', backgroundColor: '#ffffff', border: '1.5px solid #bee3f8', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', color: '#2b6cb0', fontWeight: '600', fontFamily: 'Segoe UI, sans-serif', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  accesoIcono: { fontSize: '1.5rem' },
};

export default Dashboard;
