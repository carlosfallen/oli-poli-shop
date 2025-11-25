// FILE: src/components/ProductModal.tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FiX, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      document.body.style.overflow = 'hidden';
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(contentRef.current, 
        { scale: 0.9, y: 50, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  const handleClose = () => {
    gsap.to(contentRef.current, { scale: 0.9, y: 50, opacity: 0, duration: 0.3 });
    gsap.to(modalRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      handleClose();
    }
  };

  if (!product) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        ref={contentRef}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 rounded-t-3xl overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl">
                {product.emoji}
              </div>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-purple-500 font-bold uppercase tracking-wider mb-2">{product.category}</p>
          <h2 className="text-2xl font-black text-gray-800 mb-2">{product.name}</h2>
          <p className="text-gray-500 mb-4">{product.description}</p>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-pink-500">R$ {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">R$ {product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-600 font-medium">Quantidade:</span>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-pink-100 transition-colors shadow-sm"
              >
                <FiMinus />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-pink-100 transition-colors shadow-sm"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-purple-300/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FiShoppingCart className="text-xl" />
            Adicionar ao Carrinho - R$ {(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;