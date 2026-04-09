/**
 * Login.jsx
 * Página de inicio de sesión del sistema de inventario.
 *
 * Funcionalidades:
 *  - Formulario con email y contraseña
 *  - Validaciones básicas de campos
 *  - Conexión con AuthContext para guardar la sesión
 *  - Redirección automática al Dashboard tras login exitoso
 *
 * @author      Yuli Tatiana Moreno Vásquez
 * @version     1.0.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formulario, setFormulario] = useState({ email: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorCredenciales, setErrorCredenciales] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
    setErrorCredenciales('');
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      nuevosErrores.email = 'Ingresa un email válido.';
    }
    if (!formulario.contrasena.trim()) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria.';
    } else if (formulario.contrasena.length < 4) {
      nuevosErrores.contrasena = 'Mínimo 4 caracteres.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setCargando(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const credencialesValidas =
        formulario.email === 'admin@inventario.com' &&
        formulario.contrasena === '1234';
      if (!credencialesValidas) {
        setErrorCredenciales('Email o contraseña incorrectos.');
        return;
      }
      login({ nombre: 'Administrador', email: formulario.email, rol: 'admin' });
      navigate('/dashboard');
    } catch (error) {
      setErrorCredenciales('Ocurrió un error. Intenta de nuevo.');
      console.error('Error en login:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.pagina}>
      <div style={estilos.tarjeta}>
        <div style={estilos.encabezado}>
          <h1 style={estilos.titulo}>📦 Inventario</h1>
          <p style={estilos.subtitulo}>Inicia sesión para continuar</p>
        </div>
        {errorCredenciales && (
          <div style={estilos.alertaError}>⚠️ {errorCredenciales}</div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div style={estilos.grupo}>
            <label style={estilos.etiqueta} htmlFor="email">Correo electrónico</label>
            <input
              id="email" name="email" type="email"
              value={formulario.email} onChange={handleChange}
              placeholder="admin@inventario.com"
              style={{ ...estilos.input, borderColor: errores.email ? '#e53e3e' : '#cbd5e0' }}
              disabled={cargando}
            />
            {errores.email && <span style={estilos.errorTexto}>{errores.email}</span>}
          </div>
          <div style={estilos.grupo}>
            <label style={estilos.etiqueta} htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena" name="contrasena" type="password"
              value={formulario.contrasena} onChange={handleChange}
              placeholder="••••••••"
              style={{ ...estilos.input, borderColor: errores.contrasena ? '#e53e3e' : '#cbd5e0' }}
              disabled={cargando}
            />
            {errores.contrasena && <span style={estilos.errorTexto}>{errores.contrasena}</span>}
          </div>
          <button
            type="submit"
            style={{ ...estilos.boton, opacity: cargando ? 0.7 : 1, cursor: cargando ? 'not-allowed' : 'pointer' }}
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p style={estilos.hint}>
          🔑 Prueba: <strong>admin@inventario.com</strong> / <strong>1234</strong>
        </p>
      </div>
    </div>
  );
}

const estilos = {
  pagina: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8', fontFamily: 'Segoe UI, sans-serif' },
  tarjeta: { backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  encabezado: { textAlign: 'center', marginBottom: '1.8rem' },
  titulo: { fontSize: '1.8rem', fontWeight: '700', color: '#2d3748', margin: '0 0 0.4rem' },
  subtitulo: { color: '#718096', margin: 0, fontSize: '0.95rem' },
  grupo: { marginBottom: '1.2rem', display: 'flex', flexDirection: 'column' },
  etiqueta: { fontSize: '0.875rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.4rem' },
  input: { padding: '0.65rem 0.9rem', fontSize: '0.95rem', border: '1.5px solid #cbd5e0', borderRadius: '8px', outline: 'none', color: '#2d3748' },
  errorTexto: { color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.3rem' },
  boton: { width: '100%', padding: '0.75rem', backgroundColor: '#3182ce', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', borderRadius: '8px', marginTop: '0.5rem' },
  alertaError: { backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  hint: { textAlign: 'center', color: '#a0aec0', fontSize: '0.8rem', marginTop: '1.5rem' },
};

export default Login;