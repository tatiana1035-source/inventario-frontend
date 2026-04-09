/**
 * App.jsx
 * Componente raíz de la aplicación.
 * Configura el proveedor de autenticación y el sistema de rutas.
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;