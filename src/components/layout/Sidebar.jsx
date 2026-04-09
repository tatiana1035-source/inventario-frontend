/**
 * Sidebar.jsx
 * Menú lateral de navegación del sistema de inventario.
 * Muestra los módulos disponibles según el rol del usuario.
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Definición de módulos del menú lateral */
const modulos = [
  { ruta: '/dashboard',    etiqueta: 'Dashboard',                icono: '📊' },
  { ruta: '/inventario',   etiqueta: 'Inventario por categoría', icono: '📦' },
  { ruta: '/movimientos',  etiqueta: 'Registrar entradas/salidas', icono: '🔄' },
  { ruta: '/buscar',       etiqueta: 'Buscar productos',         icono: '🔍' },
  { ruta: '/alertas',      etiqueta: 'Alertas',                  icono: '🔔' },
  { ruta: '/reportes',     etiqueta: 'Reportes',                 icono: '📈' },
  { ruta: '/historial',    etiqueta: 'Historial',                icono: '📋' },
  { ruta: '/proveedores',  etiqueta: 'Proveedores',              icono: '🏭' },
  { ruta: '/usuarios',     etiqueta: 'Usuarios',                 icono: '👥' },
];

function Sidebar() {
  const { usuario, logout } = useAuth();

  return (
    <aside style={estilos.sidebar}>
      {/* ── Logo / Nombre del sistema ── */}
      <div style={estilos.logo}>
        <span style={estilos.logoIcono}>📦</span>
        <span style={estilos.logoTexto}>StockLogic</span>
      </div>

      {/* ── Info del usuario ── */}
      <div style={estilos.usuarioInfo}>
        <div style={estilos.avatarCirculo}>
          {usuario?.nombre?.charAt(0) || 'U'}
        </div>
        <div>
          <p style={estilos.usuarioNombre}>{usuario?.nombre || 'Usuario'}</p>
          <p style={estilos.usuarioRol}>{usuario?.rol || 'rol'}</p>
        </div>
      </div>

      {/* ── Módulos de navegación ── */}
      <nav style={estilos.nav}>
        {modulos.map((mod) => (
          <NavLink
            key={mod.ruta}
            to={mod.ruta}
            style={({ isActive }) => ({
              ...estilos.enlace,
              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: isActive ? '700' : '400',
            })}
          >
            <span style={estilos.icono}>{mod.icono}</span>
            {mod.etiqueta}
          </NavLink>
        ))}
      </nav>

      {/* ── Cerrar sesión ── */}
      <button style={estilos.botonLogout} onClick={logout}>
        🔴 Cerrar sesión
      </button>
    </aside>
  );
}

const estilos = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: '#2b6cb0',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0 1.25rem',
    marginBottom: '1.5rem',
  },
  logoIcono: { fontSize: '1.5rem' },
  logoTexto: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  usuarioInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: '1rem',
  },
  avatarCirculo: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#2b6cb0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
    flexShrink: 0,
  },
  usuarioNombre: {
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '600',
    margin: 0,
  },
  usuarioRol: {
    color: '#bee3f8',
    fontSize: '0.75rem',
    margin: 0,
    textTransform: 'capitalize',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '0 0.75rem',
    gap: '0.25rem',
  },
  enlace: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
    fontFamily: 'Segoe UI, sans-serif',
  },
  icono: { fontSize: '1rem', width: '20px', textAlign: 'center' },
  botonLogout: {
    margin: '1rem 1.25rem 0',
    padding: '0.6rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'Segoe UI, sans-serif',
  },
};

export default Sidebar;