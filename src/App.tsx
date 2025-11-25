// FILE: src/App.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { FiArrowUpRight, FiInstagram, FiShoppingBag, FiMapPin, FiClock, FiPhone, FiSend, FiShoppingCart } from 'react-icons/fi';

import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Product, SiteConfig, Category } from './types';
import { subscribeToProducts, subscribeToSiteConfig, getCategories, getFeaturedProducts } from './services/firebaseService';

import Cart from './components/Cart';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import FloatingCartButton from './components/FloatingCartButton';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminSettings from './pages/Admin/AdminSettings';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { setIsOpen, itemCount } = useCart();

  useEffect(() => {
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubConfig = subscribeToSiteConfig(setConfig);
    getCategories().then(setCategories);
    getFeaturedProducts().then(setFeaturedProducts);
    
    return () => {
      unsubProducts();
      unsubConfig();
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Hero animations
      const heroLines = document.querySelectorAll('.hero-line');
      gsap.from(heroLines, {
        y: 120,
        opacity: 0,
        duration: 1.5,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.3
      });

      // Parallax hero image
      gsap.to('.hero-img', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Scale down hero on scroll
      gsap.to('.hero-content', {
        scale: 0.9,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-container',
          start: 'center top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Marquee animation
      gsap.to('.marquee-inner', {
        xPercent: -50,
        ease: 'none',
        duration: 15,
        repeat: -1
      });

      gsap.to('.marquee-inner-reverse', {
        xPercent: 50,
        ease: 'none',
        duration: 18,
        repeat: -1
      });

      // Floating elements
      const floatingElements = gsap.utils.toArray<HTMLElement>('.floating');
      floatingElements.forEach((el, i) => {
        gsap.to(el, {
          y: 'random(-25, 25)',
          x: 'random(-15, 15)',
          rotation: 'random(-20, 20)',
          duration: 'random(2.5, 4.5)',
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.15
        });
      });

      // Section reveals with parallax
      const sections = gsap.utils.toArray<HTMLElement>('.section-reveal');
      sections.forEach((section) => {
        gsap.from(section, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Product cards stagger
      ScrollTrigger.batch('.product-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 80,
            opacity: 0,
            rotation: gsap.utils.random(-5, 5),
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(1.4)',
          });
        },
        start: 'top 90%',
      });

      // Stats counter animation
      const statsNumbers = gsap.utils.toArray<HTMLElement>('.stat-number');
      statsNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-value') || '0', 10);
        gsap.to(stat, {
          textContent: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
          }
        });
      });

      // Horizontal scroll for categories
      const categoriesWrapper = document.querySelector('.categories-scroll');
      if (categoriesWrapper) {
        gsap.to(categoriesWrapper, {
          x: () => -(categoriesWrapper.scrollWidth - window.innerWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: '.categories-section',
            start: 'top top',
            end: () => `+=${categoriesWrapper.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });
      }

      // Text reveal animation
      const textReveals = gsap.utils.toArray<HTMLElement>('.text-reveal');
      textReveals.forEach((text) => {
        gsap.from(text, {
          y: '100%',
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 90%',
          }
        });
      });

      // Magnetic button effect
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (btn as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left - rect.width / 2;
          const y = mouseEvent.clientY - rect.top - rect.height / 2;
          
          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      });

      // Footer reveal
      gsap.from('.footer-title', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 75%',
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [products, categories]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const testimonials = [
    { name: 'Maria Clara', location: 'Teresina, PI', text: 'A loja mais fofa que já conheci! Os presentes são únicos e o atendimento é impecável. 🎀', rating: 5, emoji: '🥰' },
    { name: 'João Pedro', location: 'Parnaíba, PI', text: 'Comprei um cofrinho para minha filha e ela amou! Produtos de qualidade e entrega rápida. 🎁', rating: 5, emoji: '😍' },
    { name: 'Ana Beatriz', location: 'Picos, PI', text: 'Sempre encontro algo diferente aqui. A curadoria é incrível, fogem do básico mesmo! ✨', rating: 5, emoji: '🤩' }
  ];

  return (
    <div ref={containerRef} className="w-full min-h-screen font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">
      
      {/* Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating absolute top-20 left-10 text-6xl opacity-20">🎈</div>
        <div className="floating absolute top-40 right-20 text-5xl opacity-20">⭐</div>
        <div className="floating absolute top-60 left-1/4 text-4xl opacity-20">🎀</div>
        <div className="floating absolute bottom-40 right-1/4 text-6xl opacity-20">🎪</div>
        <div className="floating absolute bottom-20 left-20 text-5xl opacity-20">🌈</div>
        <div className="floating absolute top-1/3 right-10 text-4xl opacity-20">✨</div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎪</span>
          <span className="text-2xl font-display font-black tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Oli Poli.
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide">
          <a href="#loja" className="text-gray-700 hover:text-pink-500 transition-colors">Loja</a>
          <a href="#sobre" className="text-gray-700 hover:text-purple-500 transition-colors">Sobre</a>
          <a href="#depoimentos" className="text-gray-700 hover:text-indigo-500 transition-colors">Depoimentos</a>
          <a href="#contato" className="text-gray-700 hover:text-cyan-500 transition-colors">Contato</a>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            <FiShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-800 rounded-full flex items-center justify-center text-xs font-black">
                {itemCount}
              </span>
            )}
          </button>
          <a 
            href={`https://wa.me/${config?.whatsappNumber?.replace(/\D/g, '') || '86999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-green-300/50 transition-all"
          >
            <span>WhatsApp</span> <FiArrowUpRight />
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-container relative w-full min-h-screen flex flex-col justify-center px-6 md:px-20 pt-24 pb-12 overflow-hidden bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating absolute w-3 h-3 rounded-full"
              style={{
                background: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'][i % 7],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.6
              }}
            />
          ))}
        </div>

        <div className="hero-content z-10 relative">
          <div className="overflow-hidden">
            <p className="hero-line inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
              <span>🎉</span> Desde o Piauí para o mundo
            </p>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-line text-[11vw] md:text-[7vw] leading-[0.95] font-display font-black tracking-tight">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                {config?.heroTitle?.split(' ')[0] || 'COMPRE'}
              </span>{' '}
              <span className="text-yellow-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                {config?.heroTitle?.split(' ').slice(1).join(' ') || 'ALEGRIA!'}
              </span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-line text-[11vw] md:text-[7vw] leading-[0.95] font-display font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {config?.heroSubtitle?.split(' ')[0] || 'PRESENTEIE'}
              </span>{' '}
              <span className="text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                {config?.heroSubtitle?.split(' ').slice(1).join(' ') || 'FELICIDADE!'}
              </span>
            </h1>
          </div>
          
          <div className="overflow-hidden mt-8 md:mt-10">
            <p className="hero-line text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              🎪 {config?.heroDescription || 'A loja mais autêntica e divertida do Piauí!'}
            </p>
          </div>

          <div className="overflow-hidden mt-8">
            <div className="hero-line flex flex-wrap gap-4">
              <a href="#loja" className="magnetic-btn group inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-7 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-pink-300/50 transition-all">
                <FiShoppingBag className="group-hover:rotate-12 transition-transform" /> Ver Produtos
              </a>
              <a href="#sobre" className="magnetic-btn inline-flex items-center gap-2 bg-white border-3 border-purple-500 text-purple-500 px-7 py-4 rounded-full font-bold text-lg hover:bg-purple-500 hover:text-white transition-all">
                Conhecer a Loja
              </a>
            </div>
          </div>

          <div className="hero-line flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center gap-1 bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">⭐ +{products.length || 500} Produtos</span>
            <span className="inline-flex items-center gap-1 bg-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-bold">🚀 Entrega Rápida</span>
            <span className="inline-flex items-center gap-1 bg-pink-300 text-pink-800 px-3 py-1 rounded-full text-sm font-bold">💖 100% Amor</span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[55vw] h-full opacity-90 md:opacity-100 z-0 pointer-events-none">
          <div className="relative w-full h-full">
            <img 
              src={config?.bannerImages?.[0] || "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2070&auto=format&fit=crop"}
              alt="Brinquedos coloridos" 
              className="hero-img w-full h-[120%] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 md:left-20 z-10">
          <p className="text-sm text-purple-500 font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="animate-bounce">👇</span> Role para explorar
          </p>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 overflow-hidden">
        <div className="marquee-inner flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-4xl md:text-5xl font-display font-black text-white/90 uppercase px-4 flex items-center gap-4">
              <span>🎈</span> Brinquedos <span>⭐</span> Presentes <span>🎁</span> Decoração <span>🧸</span> Diversão <span>✨</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 md:px-20 bg-white relative overflow-hidden section-reveal">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { emoji: '🎁', value: products.length || 500, label: 'Produtos Únicos', color: 'from-pink-100 to-pink-200', textColor: 'text-pink-600' },
            { emoji: '😍', value: 2000, label: 'Clientes Felizes', color: 'from-purple-100 to-purple-200', textColor: 'text-purple-600' },
            { emoji: '🎪', value: 5, label: 'Anos de Magia', color: 'from-indigo-100 to-indigo-200', textColor: 'text-indigo-600' },
            { emoji: '⭐', value: 100, label: '% Satisfação', color: 'from-yellow-100 to-yellow-200', textColor: 'text-yellow-600' },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl hover:scale-105 transition-transform duration-300`}>
              <p className="text-4xl mb-2">{stat.emoji}</p>
              <p className={`stat-number text-4xl md:text-5xl font-display font-black ${stat.textColor}`} data-value={stat.value}>0</p>
              <p className={`text-sm mt-2 ${stat.textColor} font-bold opacity-80`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 section-reveal">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
                <span>⭐</span> Destaques
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-black">
                Produtos em{' '}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">destaque!</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS SECTION */}
      <section id="loja" className="py-24 px-6 md:px-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 section-reveal">
            <p className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
              <span>🛍️</span> Nossos Produtos
            </p>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">
              Curadoria do{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                extraordinário!
              </span>{' '}
              <span className="text-4xl">✨</span>
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 section-reveal">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🎪 Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.name
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" className="py-24 px-6 md:px-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute top-20 right-20 text-8xl opacity-10 rotate-12">🎠</div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="section-reveal">
            <p className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
              <span>💫</span> Nossa História
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-6">
              Nascemos do amor por{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                coisas mágicas!
              </span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              🌟 A <strong className="text-pink-500">Oli Poli</strong> surgiu da paixão por encontrar produtos únicos que contam histórias e espalham alegria.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              🎪 Do coração do <strong className="text-purple-500">Piauí</strong>, levamos diversão para todo o Brasil!
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-pink-100 px-4 py-2 rounded-full">
                <span className="text-2xl">🎀</span>
                <span className="font-bold text-pink-700">Produtos Exclusivos</span>
              </div>
              <div className="flex items-center gap-3 bg-purple-100 px-4 py-2 rounded-full">
                <span className="text-2xl">💝</span>
                <span className="font-bold text-purple-700">Feito com Amor</span>
              </div>
            </div>
          </div>
          <div className="section-reveal relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-purple-200 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070&auto=format&fit=crop" 
                alt="Nossa Loja" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-5xl font-display font-black">+5</p>
              <p className="text-sm font-bold">Anos de Magia ✨</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos" className="py-24 px-6 md:px-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 section-reveal">
            <p className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
              <span>💬</span> Depoimentos
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight">
              O que dizem sobre{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">nós!</span>{' '}
              🥰
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="section-reveal bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{testimonial.emoji}</div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t-2 border-dashed border-gray-200 pt-4">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMapPin className="text-pink-500" /> {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 section-reveal">
            <h2 className="text-4xl md:text-5xl font-display font-black">
              Por que escolher a{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Oli Poli?</span>{' '}
              🤔
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🎁', title: 'Produtos Exclusivos', desc: 'Cada peça é selecionada a dedo!', color: 'from-pink-50 to-pink-100', accent: 'from-pink-400 to-rose-500', textColor: 'text-pink-700' },
              { emoji: '💖', title: 'Atendimento Especial', desc: 'Tratamos você com muito carinho!', color: 'from-purple-50 to-purple-100', accent: 'from-purple-400 to-indigo-500', textColor: 'text-purple-700' },
              { emoji: '🚀', title: 'Entrega Rápida', desc: 'Enviamos para todo o Brasil!', color: 'from-cyan-50 to-cyan-100', accent: 'from-cyan-400 to-blue-500', textColor: 'text-cyan-700' },
            ].map((item, index) => (
              <div key={index} className={`section-reveal group text-center p-8 rounded-3xl bg-gradient-to-br ${item.color} hover:scale-105 transition-all duration-300`}>
                <div className={`w-20 h-20 bg-gradient-to-br ${item.accent} rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg group-hover:rotate-12 transition-transform`}>
                  {item.emoji}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${item.textColor}`}>{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <section className="py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 overflow-hidden">
        <div className="marquee-inner-reverse flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-2xl md:text-3xl font-display font-black text-white uppercase px-4 flex items-center gap-4">
              <span>🎉</span> FRETE GRÁTIS <span>🎊</span> PARCELAMOS <span>💳</span> PIX COM DESCONTO <span>🎁</span> EMBALAGEM PRESENTE <span>✨</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contato" className="py-24 px-6 md:px-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <div className="section-reveal">
            <p className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold tracking-widest uppercase text-sm mb-4 px-4 py-2 rounded-full">
              <span>📍</span> Visite-nos
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-8">
              Venha conhecer a{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">loja!</span>{' '}
              🎪
            </h2>
            
            <div className="space-y-6">
              {[
                { icon: FiMapPin, label: 'Endereço', value: config?.address || 'Rua das Flores, 123 - Centro, Teresina, PI', color: 'from-pink-400 to-rose-500' },
                { icon: FiClock, label: 'Horário', value: config?.workingHours || 'Seg a Sex: 9h às 18h | Sáb: 9h às 13h', color: 'from-purple-400 to-indigo-500' },
                { icon: FiPhone, label: 'WhatsApp', value: config?.whatsappNumber || '(86) 99999-9999', color: 'from-green-400 to-emerald-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                    <item.icon />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.label}</p>
                    <p className="text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="section-reveal">
            <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl overflow-hidden shadow-2xl p-2">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.0!2d-42.8!3d-5.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDYnMDAuMCJTIDQywrA0OCcwMC4wIlc!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr"
                width="100%" 
                height="100%" 
                className="rounded-2xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Localização Oli Poli"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center text-white relative z-10 section-reveal">
          <span className="text-6xl mb-4 block">💌</span>
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4">Fique por dentro!</h2>
          <p className="text-white/80 text-lg mb-8">Receba em primeira mão nossas ofertas e lançamentos exclusivos! 🎉</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="✉️ Seu melhor e-mail" 
              className="px-6 py-4 rounded-full text-gray-800 w-full sm:w-96 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
            />
            <button className="magnetic-btn group px-8 py-4 bg-yellow-400 text-gray-800 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <FiSend className="group-hover:translate-x-1 transition-transform" /> Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white pt-24 pb-12 px-6 md:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <p className="footer-title inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold tracking-widest uppercase text-sm mb-8 px-4 py-2 rounded-full">
            <span>👀</span> Não fique só olhando
          </p>
          <h2 className="footer-title text-[12vw] md:text-[8vw] leading-[0.85] font-display font-black tracking-tight mb-8">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">VEM PRA</span>
            <br/>
            <span className="text-yellow-400">LOJA!</span> 🎉
          </h2>
          
          <a 
            href={`https://wa.me/${config?.whatsappNumber?.replace(/\D/g, '') || '86999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-title magnetic-btn group inline-flex items-center gap-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-green-400/50 transition-all duration-300"
          >
            <FiShoppingBag className="text-2xl group-hover:rotate-12 transition-transform" /> 
            Falar no WhatsApp
          </a>
        </div>

        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-white/10 pt-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎪</span>
              <span className="text-2xl font-display font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Oli Poli.</span>
            </div>
            <p className="text-gray-400 text-sm">A loja mais autêntica e divertida do Piauí! 🎁</p>
          </div>
          <div>
            <p className="font-bold mb-4 text-pink-400">Links</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#loja" className="hover:text-pink-400 transition-colors">🛍️ Loja</a></li>
              <li><a href="#sobre" className="hover:text-purple-400 transition-colors">💫 Sobre</a></li>
              <li><a href="#depoimentos" className="hover:text-indigo-400 transition-colors">💬 Depoimentos</a></li>
              <li><a href="#contato" className="hover:text-cyan-400 transition-colors">📍 Contato</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold mb-4 text-purple-400">Categorias</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <a href="#loja" className="hover:text-pink-400 transition-colors">{cat.emoji} {cat.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold mb-4 text-cyan-400">Contato</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📱 {config?.whatsappNumber || '(86) 99999-9999'}</li>
              <li>✉️ oi@olipoli.com.br</li>
              <li>📍 Teresina, PI</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-sm text-gray-400">
          <p>© 2024 Oli Poli Shop. Feito com 💖 no Piauí.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href={config?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <FiInstagram className="text-white"/>
            </a>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart whatsappNumber={config?.whatsappNumber || '86999999999'} />
      
      {/* Floating Cart Button */}
      <FloatingCartButton />
      
      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;