// FILE: src/components/FloatingCartButton.tsx
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
  const { itemCount, setIsOpen, total } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (itemCount > 0) {
      gsap.fromTo(badgeRef.current, 
        { scale: 0 }, 
        { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <button
      ref={buttonRef}
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-4 rounded-full shadow-2xl shadow-purple-300/50 hover:scale-110 transition-transform flex items-center gap-3"
    >
      <FiShoppingCart className="text-2xl" />
      <div className="text-left hidden sm:block">
        <p className="text-xs opacity-80">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
        <p className="font-bold">R$ {total.toFixed(2)}</p>
      </div>
      <span 
        ref={badgeRef}
        className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-gray-800 rounded-full flex items-center justify-center text-xs font-black sm:hidden"
      >
        {itemCount}
      </span>
    </button>
  );
};

export default FloatingCartButton;