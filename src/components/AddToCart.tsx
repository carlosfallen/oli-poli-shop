import { createSignal } from 'solid-js';
import type { Product } from '../lib/types';

interface Props {
  product: Product;
}

export default function AddToCart(props: Props) {
  const [quantity, setQuantity] = createSignal(1);
  const [added, setAdded] = createSignal(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === props.product.id);

    if (existingItem) {
      existingItem.quantity += quantity();
    } else {
      cart.push({
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        quantity: quantity(),
        image_url: props.product.image_url,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity() - 1))}
          class="w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
        >
          -
        </button>
        <span class="w-12 text-center">{quantity()}</span>
        <button
          onClick={() => setQuantity(quantity() + 1)}
          class="w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
        >
          +
        </button>
      </div>
      <button
        onClick={addToCart}
        class={`btn ${added() ? 'btn-success' : 'btn-primary'} flex-1 flex items-center justify-center gap-2`}
      >
        {added() ? (
          <>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Adicionado!
          </>
        ) : (
          <>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Adicionar ao Carrinho
          </>
        )}
      </button>
    </div>
  );
}
