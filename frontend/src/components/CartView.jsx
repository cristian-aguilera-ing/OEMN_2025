import React from 'react';

export const CartView = () => {
  // Cambia esto a 'false' para ver el item de ejemplo
  const isEmpty = true; 

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto">
      {isEmpty ? (
        <p className="text-center text-slate-500 py-8">Tu carrito está vacío.</p>
      ) : (
        // --- CORRECCIÓN AQUÍ ---
        // El comentario ahora está DENTRO del 'div'
        <div className="flow-root">
          {/* Item de ejemplo (cuando no está vacío) */}
          <ul className="-my-4 divide-y divide-slate-200">
            <li className="flex items-center space-x-4 py-4">
              <div className="h-16 w-16 flex-shrink-0 rounded-md bg-slate-200" /> {/* Placeholder de imagen */}
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">Producto de Ejemplo</h4>
                <p className="text-sm text-slate-500">1 x $99.00</p>
              </div>
              <button className="text-sm font-medium text-red-500 hover:text-red-700">Quitar</button>
            </li>
            {/* ...puedes añadir más items aquí... */}
          </ul>
        </div>
      )}
      
      {/* Total y Botón */}
      <div className="pt-4 border-t sticky bottom-0 bg-white">
        <div className="flex justify-between font-medium text-slate-800">
          <p>Subtotal</p>
          <p>{isEmpty ? '$0.00' : '$99.00'}</p>
        </div>
        <button
          disabled={isEmpty}
          className="mt-4 w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};