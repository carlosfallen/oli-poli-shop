// FILE: src/components/ProductCard.tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };

  return (
    <div
      ref={cardRef}
      className="product-card group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden aspect-square mb-4 rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-1">
        <div className="w-full h-full bg-white rounded-[20px] overflow-hidden relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
              alt={product.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-gray-50 to-gray-100">
              {product.emoji}
            </div>
          )}
          
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
          
          <div className="absolute top-3 right-3 text-3xl bg-white/90 backdrop-blur rounded-xl p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            {product.emoji}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white text-gray-800 py-2 rounded-full font-bold text-sm hover:bg-pink-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingCart /> Adicionar
              </button>
              {onQuickView && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <FiEye />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-2">
        <p className="text-xs text-purple-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-black text-pink-500">R$ {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">R$ {product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-500 font-bold mt-1">⚡ Apenas {product.stock} em estoque!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;