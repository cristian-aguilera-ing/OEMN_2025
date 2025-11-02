import React from 'react';

export const LoginForm = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}> {/* previene que la página se recargue */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="tu@correo.com"
            className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors"
        >
          Iniciar Sesión
        </button>
        <div className="text-sm text-center">
          <a href="#" className="font-medium text-sky-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </form>
  );
};