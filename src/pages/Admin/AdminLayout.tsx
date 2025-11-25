// FILE: src/pages/Admin/AdminLayout.tsx
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiPackage, FiSettings, FiGrid, FiLogOut, FiExternalLink } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-bounce block">🎪</span>
          <p className="text-gray-500 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: FiPackage, label: 'Produtos' },
    { path: '/admin/categories', icon: FiGrid, label: 'Categorias' },
    { path: '/admin/settings', icon: FiSettings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-xl fixed h-full">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎪</span>
            <span className="text-xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Oli Poli
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Painel Administrativo</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-colors mb-3 text-sm"
          >
            <FiExternalLink /> Ver Loja
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm w-full"
          >
            <FiLogOut /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;