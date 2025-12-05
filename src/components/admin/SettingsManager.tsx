import { createSignal, createResource } from 'solid-js';
import type { Settings } from '../../lib/types';

export default function SettingsManager() {
  const [settings, { refetch }] = createResource<Settings>(fetchSettings);
  const [isSaving, setIsSaving] = createSignal(false);

  async function fetchSettings() {
    const response = await fetch('/api/settings');
    return response.json();
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setIsSaving(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      company_name: formData.get('company_name') as string,
      whatsapp: formData.get('whatsapp') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      description: formData.get('description') as string,
      banner_url: formData.get('banner_url') as string,
      logo_url: formData.get('logo_url') as string,
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
        refetch();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Configurações da Empresa</h1>

      <div class="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit} class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Nome da Empresa *</label>
            <input
              type="text"
              name="company_name"
              required
              value={settings()?.company_name || ''}
              class="input"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">WhatsApp Principal *</label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={settings()?.whatsapp || ''}
                class="input"
                placeholder="5511999999999"
              />
              <p class="text-xs text-gray-500 mt-1">Formato: 5511999999999 (sem espaços ou caracteres)</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Telefone Secundário</label>
              <input
                type="tel"
                name="phone"
                value={settings()?.phone || ''}
                class="input"
                placeholder="(11) 3333-4444"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Endereço Completo</label>
            <textarea
              name="address"
              rows="3"
              value={settings()?.address || ''}
              class="input"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Descrição da Loja</label>
            <textarea
              name="description"
              rows="3"
              value={settings()?.description || ''}
              class="input"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">URL do Banner (Landing Page)</label>
            <input
              type="text"
              name="banner_url"
              value={settings()?.banner_url || ''}
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">URL do Logo</label>
            <input
              type="text"
              name="logo_url"
              value={settings()?.logo_url || ''}
              class="input"
            />
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button type="submit" class="btn-primary" disabled={isSaving()}>
              {isSaving() ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
