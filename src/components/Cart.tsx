// FILE: src/components/Cart.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

interface CartProps {
  whatsappNumber: string;
}

const Cart = ({ whatsappNumber }: CartProps) => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(cartRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(cartRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isOpen]);

  const sendToWhatsApp = () => {
    if (items.length === 0) return;

    let message = '🎪 *Pedido Oli Poli*\n\n';
    message += '📦 *Itens do Pedido:*\n';
    message += '─────────────────\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.emoji} *${item.name}*\n`;
      message += `   Qtd: ${item.quantity}x | R$ ${item.price.toFixed(2)}\n`;
      message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += '─────────────────\n';
    message += `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    message += '📍 Por favor, informe seu endereço para entrega!\n';
    message += '✨ Obrigado por escolher a Oli Poli!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <div 
        ref={overlayRef}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      />
      
      <div 
        ref={cartRef}
        className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 shadow-2xl flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="p-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <div>
                <h2 className="text-xl font-bold">Seu Carrinho</h2>
                <p className="text-sm text-white/80">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg font-medium">Carrinho vazio</p>
              <p className="text-sm">Adicione produtos para começar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {item.emoji}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-pink-500 font-bold">R$ {item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 transition-colors"
                        >
                          <FiMinus className="text-sm" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 transition-colors"
                        >
                          <FiPlus className="text-sm" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                R$ {total.toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={sendToWhatsApp}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-green-300/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FiShoppingBag className="text-xl" />
              Finalizar no WhatsApp
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full mt-3 text-gray-500 py-2 hover:text-red-500 transition-colors text-sm"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;