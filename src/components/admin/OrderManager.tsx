import { createSignal, createResource, For, Show } from 'solid-js';
import type { Order, OrderStatus } from '../../lib/types';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../lib/utils';

export default function OrderManager() {
  const [orders, { refetch }] = createResource<Order[]>(fetchOrders);
  const [selectedOrder, setSelectedOrder] = createSignal<Order | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<OrderStatus | 'all'>('all');

  async function fetchOrders() {
    const response = await fetch('/api/orders');
    return response.json();
  }

  async function updateOrderStatus(id: string, status: OrderStatus) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refetch();
        if (selectedOrder()?.id === id) {
          const updated = await response.json();
          setSelectedOrder({ ...selectedOrder()!, status });
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Erro ao atualizar pedido');
    }
  }

  const filteredOrders = () => {
    const allOrders = orders() || [];
    if (statusFilter() === 'all') return allOrders;
    return allOrders.filter(order => order.status === statusFilter());
  };

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Pedidos</h1>

      <div class="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          class={`px-4 py-2 rounded-lg ${
            statusFilter() === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Todos
        </button>
        {['pending', 'confirmed', 'separated', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
          <button
            onClick={() => setStatusFilter(status as OrderStatus)}
            class={`px-4 py-2 rounded-lg ${
              statusFilter() === status ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {getOrderStatusLabel(status)}
          </button>
        ))}
      </div>

      <div class="card overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="text-left py-3 px-4 font-semibold">ID</th>
              <th class="text-left py-3 px-4 font-semibold">Cliente</th>
              <th class="text-left py-3 px-4 font-semibold">Data</th>
              <th class="text-left py-3 px-4 font-semibold">Total</th>
              <th class="text-left py-3 px-4 font-semibold">Status</th>
              <th class="text-left py-3 px-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            <For each={filteredOrders()}>
              {(order) => (
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 font-mono text-sm">#{order.id.slice(0, 12)}</td>
                  <td class="py-3 px-4">
                    <div>
                      <p class="font-medium">{order.name}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{order.phone}</p>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm">{formatDate(order.created_at)}</td>
                  <td class="py-3 px-4 font-bold text-primary-600">{formatPrice(order.total)}</td>
                  <td class="py-3 px-4">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <button onClick={() => setSelectedOrder(order)} class="text-blue-600 hover:text-blue-700">
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Show when={selectedOrder()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 class="text-2xl font-bold mb-6">Pedido #{selectedOrder()!.id}</h2>

            <div class="space-y-6">
              <div>
                <h3 class="font-semibold mb-3">Status do Pedido</h3>
                <select
                  value={selectedOrder()!.status}
                  onChange={(e) => updateOrderStatus(selectedOrder()!.id, e.target.value as OrderStatus)}
                  class="input"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="separated">Separado</option>
                  <option value="out-for-delivery">Saiu para Entrega</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <h3 class="font-semibold mb-3">Dados do Cliente</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                    <p class="font-medium">{selectedOrder()!.name}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                    <p class="font-medium">
                      <a href={`https://wa.me/${selectedOrder()!.phone.replace(/\D/g, '')}`} target="_blank" class="text-green-600 hover:text-green-700">
                        {selectedOrder()!.phone}
                      </a>
                    </p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Endereço</p>
                    <p class="font-medium">{selectedOrder()!.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="font-semibold mb-3">Itens do Pedido</h3>
                <div class="space-y-3">
                  <For each={selectedOrder()!.items}>
                    {(item: any) => (
                      <div class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                        <img src={item.image_url} alt={item.name} class="w-16 h-16 object-cover rounded" />
                        <div class="flex-1">
                          <p class="font-medium">{item.name}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">Qtd: {item.quantity}</p>
                        </div>
                        <p class="font-bold text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    )}
                  </For>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span class="text-primary-600">{formatPrice(selectedOrder()!.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <button onClick={() => setSelectedOrder(null)} class="btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
