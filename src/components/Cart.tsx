import { createSignal, createEffect, For } from 'solid-js';
import type { CartItem } from '../lib/types';
import { formatPrice, calculateTotal } from '../lib/utils';

export default function Cart() {
  const [cart, setCart] = createSignal<CartItem[]>([]);
  const [isOpen, setIsOpen] = createSignal(false);

  createEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  });

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const newCart = cart().filter(item => item.id !== id);
    updateCart(newCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    const newCart = cart().map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    updateCart(newCart);
  };

  const total = () => calculateTotal(cart());

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        {cart().length > 0 && (
          <span class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cart().reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div
            class="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold">Carrinho</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {cart().length === 0 ? (
                <div class="text-center py-12">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p class="text-gray-500">Seu carrinho está vazio</p>
                  <a href="/loja" class="btn-primary mt-4 inline-block">
                    Ir para a loja
                  </a>
                </div>
              ) : (
                <>
                  <div class="space-y-4">
                    <For each={cart()}>
                      {(item) => (
                        <div class="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            class="w-20 h-20 object-cover rounded-lg"
                          />
                          <div class="flex-1">
                            <h3 class="font-semibold">{item.name}</h3>
                            <p class="text-primary-600 font-bold">{formatPrice(item.price)}</p>
                            <div class="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                -
                              </button>
                              <span class="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                class="ml-auto text-red-600 hover:text-red-700"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span class="text-primary-600">{formatPrice(total())}</span>
                    </div>
                    <a href="/checkout" class="btn-primary w-full text-center block">
                      Finalizar Pedido
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
