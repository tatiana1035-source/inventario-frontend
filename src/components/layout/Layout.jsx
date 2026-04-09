/**
 * Layout.jsx
 * Estructura visual principal de la aplicación.
 * Envuelve todas las páginas privadas con el Sidebar lateral.
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import Sidebar from './Sidebar';

/**
 * Layout
 * Componente contenedor que combina el Sidebar con el contenido principal.
 *
 * @param {ReactNode} children - Página a renderizar en el área de contenido.
 */
function Layout({ children }) {
  return (
    <div style={estilos.contenedor}>
      {/* ── Menú lateral fijo ── */}
      <Sidebar />

      {/* ── Contenido principal desplazado por el ancho del Sidebar ── */}
      <main style={estilos.main}>
        {children}
      </main>
    </div>
  );
}

const estilos = {
  contenedor: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  main: {
    marginLeft: '240px',   // mismo ancho que el Sidebar
    flex: 1,
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  },
};

export default Layout;