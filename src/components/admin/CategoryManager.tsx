import { createSignal, createResource, For, Show } from 'solid-js';
import type { Category } from '../../lib/types';

export default function CategoryManager() {
  const [categories, { refetch }] = createResource<Category[]>(fetchCategories);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingCategory, setEditingCategory] = createSignal<Category | null>(null);

  async function fetchCategories(): Promise<Category[]> {
    const response = await fetch(`${window.location.origin}/api/categories`);
    return response.json() as Promise<Category[]>;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
    };

    const editing = editingCategory();
    const url = editing ? `${window.location.origin}/api/categories/${editing.id}` : `${window.location.origin}/api/categories`;
    const method = editing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.reset();
        refetch();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Erro ao salvar categoria');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const response = await fetch(`${window.location.origin}/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Erro ao excluir categoria');
    }
  }

  function openModal(category?: Category) {
    setEditingCategory(category || null);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Categorias</h1>
        <button onClick={() => openModal()} class="btn-primary">
          Nova Categoria
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={categories()}>
          {(category) => (
            <div class="card p-6">
              <div class="text-4xl mb-3">{category.icon}</div>
              <h3 class="font-bold text-xl mb-2">{category.name}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {category.description}
              </p>
              <div class="flex gap-2">
                <button onClick={() => openModal(category)} class="btn-secondary flex-1">
                  Editar
                </button>
                <button onClick={() => handleDelete(category.id)} class="btn-danger flex-1">
                  Excluir
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      <Show when={isModalOpen()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <h2 class="text-2xl font-bold mb-6">
              {editingCategory() ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editingCategory()?.name || ''}
                  class="input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  name="description"
                  rows="3"
                  value={editingCategory()?.description || ''}
                  class="input"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Ícone (Emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={editingCategory()?.icon || ''}
                  class="input"
                  placeholder="🎲"
                />
              </div>

              <div class="flex gap-4 mt-6">
                <button type="submit" class="btn-primary">
                  Salvar
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} class="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}
