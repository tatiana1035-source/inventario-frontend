/**
 * AuthContext.jsx
 * Contexto global de autenticación.
 *
 * Expone:
 *  - usuario   → objeto con datos del usuario autenticado (o null).
 *  - login()   → inicia sesión y guarda el usuario en contexto.
 *  - logout()  → cierra sesión y limpia el estado.
 *
 * Uso en cualquier componente:
 *   const { usuario, login, logout } = useAuth();
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import { createContext, useContext, useState } from 'react';

// ── Creación del contexto ──────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider
 * Proveedor que envuelve la aplicación y comparte el estado de sesión.
 *
 * @param {ReactNode} children - Componentes hijos que tendrán acceso al contexto.
 */
export function AuthProvider({ children }) {
  // Estado del usuario; null = no autenticado
  const [usuario, setUsuario] = useState(null);

  /**
   * login
   * Simula el inicio de sesión. En producción, aquí llamarías a tu API.
   *
   * @param {Object} datosUsuario - Datos devueltos por el servidor tras autenticar.
   */
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  /**
   * logout
   * Cierra la sesión limpiando el estado del usuario.
   */
  const logout = () => {
    setUsuario(null);
  };

  // Valores expuestos a todos los componentes hijos
  const valor = { usuario, login, logout };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 * Hook personalizado para consumir el contexto de autenticación.
 * Lanza un error si se usa fuera de AuthProvider.
 *
 * @returns {{ usuario, login, logout }}
 */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return contexto;
}