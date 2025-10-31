import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // Tu CSS de Tailwind

// Importa el Layout
import App from './App'; 

// Importa las dos páginas
import { HomePage } from './pages/HomePage';
import DesignerPage from './pages/DesignerPage'; // Tu app de diseño

// Definimos las rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // El Layout (Navbar/Footer)
    children: [
      {
        index: true, // La ruta '/'
        element: <HomePage />,
      },
      {
        path: 'designer', // La ruta '/designer'
        element: <DesignerPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);