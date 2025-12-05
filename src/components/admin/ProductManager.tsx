import { createSignal, createResource, For, Show } from 'solid-js';
import type { Product, Category } from '../../lib/types';
import { formatPrice, slugify } from '../../lib/utils';

export default function ProductManager() {
  const [products, { refetch }] = createResource<Product[]>(fetchProducts);
  const [categories] = createResource<Category[]>(fetchCategories);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingProduct, setEditingProduct] = createSignal<Product | null>(null);

  async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${window.location.origin}/api/products`);
    return response.json() as Promise<Product[]>;
  }

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
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      image_url: formData.get('image_url') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      featured: formData.get('featured') === 'on' ? 1 : 0,
      active: formData.get('active') === 'on' ? 1 : 0,
    };

    const editing = editingProduct();
    const url = editing ? `${window.location.origin}/api/products/${editing.id}` : `${window.location.origin}/api/products`;
    const method = editing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        form.reset();
        refetch();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`${window.location.origin}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto');
    }
  }

  function openModal(product?: Product) {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Produtos</h1>
        <button onClick={() => openModal()} class="btn-primary">
          Novo Produto
        </button>
      </div>

      <div class="card overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="text-left py-3 px-4 font-semibold">Imagem</th>
              <th class="text-left py-3 px-4 font-semibold">Nome</th>
              <th class="text-left py-3 px-4 font-semibold">Categoria</th>
              <th class="text-left py-3 px-4 font-semibold">Preço</th>
              <th class="text-left py-3 px-4 font-semibold">Estoque</th>
              <th class="text-left py-3 px-4 font-semibold">Status</th>
              <th class="text-left py-3 px-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            <For each={products()}>
              {(product) => (
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4">
                    <img src={product.image_url} alt={product.name} class="w-12 h-12 object-cover rounded" />
                  </td>
                  <td class="py-3 px-4 font-medium">{product.name}</td>
                  <td class="py-3 px-4 text-sm">{product.category}</td>
                  <td class="py-3 px-4 font-bold text-primary-600">{formatPrice(product.price)}</td>
                  <td class="py-3 px-4">{product.stock}</td>
                  <td class="py-3 px-4">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button onClick={() => openModal(product)} class="text-blue-600 hover:text-blue-700 mr-3">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product.id)} class="text-red-600 hover:text-red-700">
                      Excluir
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Show when={isModalOpen()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 class="text-2xl font-bold mb-6">
              {editingProduct() ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editingProduct()?.name || ''}
                  class="input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Categoria *</label>
                <select name="category" required class="input">
                  <option value="">Selecione uma categoria</option>
                  <For each={categories()}>
                    {(cat) => (
                      <option value={cat.id} selected={editingProduct()?.category === cat.id}>
                        {cat.name}
                      </option>
                    )}
                  </For>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  name="description"
                  rows="3"
                  value={editingProduct()?.description || ''}
                  class="input"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Preço *</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    value={editingProduct()?.price || ''}
                    class="input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Estoque</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct()?.stock || 0}
                    class="input"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">URL da Imagem</label>
                <input
                  type="text"
                  name="image_url"
                  value={editingProduct()?.image_url || ''}
                  class="input"
                />
              </div>

              <div class="flex gap-4">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editingProduct()?.featured === 1}
                    class="rounded"
                  />
                  <span class="text-sm font-medium">Produto em Destaque</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={editingProduct()?.active === 1}
                    class="rounded"
                  />
                  <span class="text-sm font-medium">Produto Ativo</span>
                </label>
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
