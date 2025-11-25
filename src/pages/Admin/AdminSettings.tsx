// FILE: src/pages/Admin/AdminSettings.tsx
import { useState, useEffect } from 'react';
import { FiSave, FiImage } from 'react-icons/fi';
import { SiteConfig } from '../../types';
import { getSiteConfig, updateSiteConfig } from '../../services/firebaseService';
import { uploadImage } from '../../services/cloudflareUpload';

const AdminSettings = () => {
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: 'COMPRE ALEGRIA!',
    heroSubtitle: 'PRESENTEIE FELICIDADE!',
    heroDescription: 'A loja mais autêntica do Piauí. Uma curadoria de brinquedos, decoração e presentes que fogem do óbvio.',
    whatsappNumber: '86999999999',
    address: 'Rua das Flores, 123 - Centro, Teresina, PI',
    workingHours: 'Seg a Sex: 9h às 18h | Sábado: 9h às 13h',
    instagramUrl: 'https://instagram.com/olipoli',
    bannerImages: [],
    showBanner: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await getSiteConfig();
    if (data) {
      setConfig(data);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setConfig(prev => ({
        ...prev,
        bannerImages: [...prev.bannerImages, url],
      }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const removeBannerImage = (index: number) => {
    setConfig(prev => ({
      ...prev,
      bannerImages: prev.bannerImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSiteConfig(config);
      alert('Configurações salvas com sucesso! 🎉');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Configurações</h1>
        <p className="text-gray-500">Personalize a loja do seu jeito ⚙️</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🎪 Hero da Página Inicial</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig(prev => ({ ...prev, heroTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={config.heroDescription}
                onChange={(e) => setConfig(prev => ({ ...prev, heroDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🖼️ Imagens do Banner</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {config.bannerImages.map((url, index) => (
              <div key={index} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
                <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeBannerImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            
            <label className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploading ? (
                <p className="text-purple-500 text-sm">Enviando...</p>
              ) : (
                <>
                  <FiImage className="text-2xl text-gray-400 mb-2" />
                  <p className="text-xs text-gray-400">Adicionar</p>
                </>
              )}
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showBanner}
              onChange={(e) => setConfig(prev => ({ ...prev, showBanner: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Exibir banner na página inicial</span>
          </label>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📞 Contato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => setConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="86999999999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="text"
                value={config.instagramUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, instagramUrl: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="https://instagram.com/olipoli"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Funcionamento</label>
              <input
                type="text"
                value={config.workingHours}
                onChange={(e) => setConfig(prev => ({ ...prev, workingHours: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          <FiSave /> {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;