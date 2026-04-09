/**
 * AppRoutes.jsx
 * Define todas las rutas de la aplicación.
 *
 * Rutas públicas  → accesibles sin sesión iniciada (ej: Login).
 * Rutas privadas  → requieren sesión activa; si no hay sesión,
 *                   redirigen automáticamente a /login.
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Páginas ---
import Login       from '../pages/auth/Login';
import Dashboard   from '../pages/dashboard/Dashboard';

// --- Layout ---
import Layout from '../components/layout/Layout';

/**
 * PrivateRoute
 * Componente de orden superior que protege rutas privadas.
 * Si el usuario NO está autenticado, lo redirige a /login.
 *
 * @param {ReactNode} children - Componente hijo a renderizar si hay sesión.
 */
function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  // Si no hay usuario en contexto, redirigir a login
  return usuario ? children : <Navigate to="/login" replace />;
}

/**
 * AppRoutes
 * Mapa completo de rutas de la aplicación.
 *
 * Agregar nuevas páginas aquí siguiendo el mismo patrón:
 *   <Route path="/nueva-ruta" element={<PrivateRoute><NuevaPagina /></PrivateRoute>} />
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ── Ruta raíz: redirige según estado de sesión ── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Rutas públicas ── */}
      <Route path="/login" element={<Login />} />

      {/* ── Rutas privadas (requieren autenticación) ── */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
      }
    />
      {/* ── Ruta 404: cualquier ruta no definida redirige al inicio ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;