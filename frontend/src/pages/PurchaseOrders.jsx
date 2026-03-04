import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Calendar, User, Package, ChevronRight, CheckCircle, Send } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import api from '../api/client';

export default function PurchaseOrders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Create state
    const [newOrder, setNewOrder] = useState({
        supplier_id: '',
        items: [{ product_id: '', quantity: 1, unit_cost: 0 }]
    });

    async function fetchData() {
        try {
            setLoading(true);
            const [ordersRes, productsRes, suppliersRes] = await Promise.all([
                api.get('/purchase-orders'),
                api.get('/products'),
                api.get('/suppliers')
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setSuppliers(suppliersRes.data);
        } catch (error) {
            alert('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/purchase-orders/${id}/status`, { status });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.detail || 'Erro ao atualizar status');
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post('/purchase-orders/', {
                ...newOrder,
                supplier_id: parseInt(newOrder.supplier_id),
                items: newOrder.items.map(i => ({
                    ...i,
                    product_id: parseInt(i.product_id),
                    quantity: parseInt(i.quantity),
                    unit_cost: parseFloat(i.unit_cost)
                }))
            });
            setIsModalOpen(false);
            setNewOrder({ supplier_id: '', items: [{ product_id: '', quantity: 1, unit_cost: 0 }] });
            fetchData();
        } catch (error) {
            alert('Erro ao criar pedido');
        }
    };

    const addItem = () => {
        setNewOrder({ ...newOrder, items: [...newOrder.items, { product_id: '', quantity: 1, unit_cost: 0 }] });
    };

    const columns = [
        {
            header: 'Pedido #',
            render: (row) => (
                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                    <ChevronRight size={14} className="text-gray-400" />
                    {row.id.toString().padStart(4, '0')}
                </div>
            )
        },
        {
            header: 'Fornecedor',
            render: (row) => {
                const s = suppliers.find(s => s.id === row.supplier_id);
                return (
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium">{s?.name || `Fornecedor #${row.supplier_id}`}</span>
                    </div>
                );
            }
        },
        {
            header: 'Data',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
                </div>
            )
        },
        { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        {
            header: 'Ações',
            render: (row) => (
                <div className="flex gap-2">
                    {row.status === 'DRAFT' && (
                        <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(row.id, 'SENT')} className="gap-1">
                            <Send size={14} /> Enviar
                        </Button>
                    )}
                    {row.status === 'SENT' && (
                        <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(row.id, 'RECEIVED')} className="gap-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle size={14} /> Recebido
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Novo Pedido
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={orders} isLoading={loading} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Pedido de Compra">
                <form onSubmit={handleCreateOrder} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fornecedor</label>
                        <select
                            required
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={newOrder.supplier_id}
                            onChange={e => setNewOrder({ ...newOrder, supplier_id: e.target.value })}
                        >
                            <option value="">Selecione o fornecedor...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Itens do Pedido</h4>
                            <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold hover:underline">
                                + Adicionar Item
                            </button>
                        </div>

                        {newOrder.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-6 gap-2 items-end bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                <div className="col-span-3">
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Produto</label>
                                    <select
                                        required
                                        className="w-full bg-white dark:bg-slate-800 border-none rounded px-2 py-1.5 text-xs outline-none dark:text-white"
                                        value={item.product_id}
                                        onChange={e => {
                                            const updated = [...newOrder.items];
                                            updated[idx].product_id = e.target.value;
                                            setNewOrder({ ...newOrder, items: updated });
                                        }}
                                    >
                                        <option value="">Selecione...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Qtd</label>
                                    <input
                                        type="number" required min="1"
                                        className="w-full bg-white dark:bg-slate-800 border-none rounded px-2 py-1.5 text-xs outline-none dark:text-white"
                                        value={item.quantity}
                                        onChange={e => {
                                            const updated = [...newOrder.items];
                                            updated[idx].quantity = e.target.value;
                                            setNewOrder({ ...newOrder, items: updated });
                                        }}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Custo Un.</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full bg-white dark:bg-slate-800 border-none rounded px-2 py-1.5 text-xs outline-none dark:text-white"
                                        value={item.unit_cost}
                                        onChange={e => {
                                            const updated = [...newOrder.items];
                                            updated[idx].unit_cost = e.target.value;
                                            setNewOrder({ ...newOrder, items: updated });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Gerar Pedido (DRAFT)</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
