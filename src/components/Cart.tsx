import { createSignal, createEffect, For } from 'solid-js';
import type { CartItem } from '../lib/types';
import { formatPrice, calculateTotal } from '../lib/utils';

export default function Cart() {
  const [cart, setCart] = createSignal<CartItem[]>([]);

  createEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Atualizar quando o carrinho mudar
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCart(JSON.parse(updatedCart));
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  });

  return (
    <a
      href="/carrinho"
      class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      {cart().length > 0 && (
        <span class="absolute -top-1 -right-1 bg-secondary-400 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {cart().reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}
    </a>
  );
}
