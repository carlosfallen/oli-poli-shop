// FILE: src/pages/Admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { FiPackage, FiShoppingBag, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { getProducts, getCategories } from '../../services/firebaseService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    lowStock: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const products = await getProducts();
      const categories = await getCategories();
      
      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        featuredProducts: products.filter(p => p.featured).length,
        lowStock: products.filter(p => p.stock <= 5).length,
      });
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total de Produtos', value: stats.totalProducts, icon: FiPackage, color: 'from-pink-500 to-rose-500', emoji: '📦' },
    { label: 'Categorias', value: stats.totalCategories, icon: FiShoppingBag, color: 'from-purple-500 to-indigo-500', emoji: '🏷️' },
    { label: 'Produtos em Destaque', value: stats.featuredProducts, icon: FiTrendingUp, color: 'from-yellow-400 to-orange-500', emoji: '⭐' },
    { label: 'Estoque Baixo', value: stats.lowStock, icon: FiUsers, color: 'from-red-500 to-pink-500', emoji: '⚠️' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo ao painel administrativo da Oli Poli! 🎪</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                <stat.icon className="text-xl" />
              </div>
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            <p className="text-3xl font-black text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;