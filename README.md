# 📦 Sistema de Inventario - Frontend

Aplicación web desarrollada con React JS + Vite para la gestión de inventario de productos.
Proyecto formativo SENA - Tecnología en Análisis y Desarrollo de Software.

## 🚀 Tecnologías utilizadas

- React JS
- Vite
- React Router DOM
- Context API (autenticación)

## 📁 Estructura del proyecto

src/
├── App.jsx              # Componente raíz y proveedor de autenticación
├── AppRoutes.jsx        # Enrutamiento con rutas públicas y privadas
├── context/
│   └── AuthContext.jsx  # Contexto global de autenticación
├── pages/
│   ├── Login.jsx        # Página de inicio de sesión
│   ├── Dashboard.jsx    # Panel principal con KPIs y alertas
│   └── Inventario.jsx   # Gestión de productos
└── components/
├── Layout.jsx        # Estructura visual principal
├── Sidebar.jsx       # Menú lateral de navegación
└── ProductoForm.jsx  # Formulario de registro/edición de productos

## ⚙️ Instalación y ejecución

1. Clona el repositorio:
```bash
   git clone https://github.com/tatiana1035-source/inventario-frontend.git
```
2. Instala las dependencias:
```bash
   npm install
```
3. Ejecuta el proyecto:
```bash
   npm run dev
```
4. Abre en el navegador: `http://localhost:5173`

## 👩‍💻 Autora

Yuli Tatiana Moreno Vásquez — Aprendiz SENA  
Evidencia: GA7-220501096-AA4-EV03
