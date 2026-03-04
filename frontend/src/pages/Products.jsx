import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download, MoreVertical, Package, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import api from '../api/client';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        cost: 0,
        price: 0,
        stock: 0,
        min_stock: 0
    });

    async function fetchProducts() {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            alert('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products/', formData);
            setIsModalOpen(false);
            setFormData({ sku: '', name: '', cost: 0, price: 0, stock: 0, min_stock: 0 });
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.detail || 'Erro ao criar produto');
        }
    };

    const columns = [
        {
            header: 'Produto',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded flex items-center justify-center text-gray-400">
                        <Package size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.sku}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Estoque',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className={`font-bold ${row.stock <= row.min_stock ? 'text-red-600' : 'text-green-600'}`}>
                        {row.stock} un
                    </span>
                    {row.stock <= row.min_stock && <AlertCircle size={14} className="text-red-500" title="Abaixo do mínimo" />}
                </div>
            )
        },
        {
            header: 'Custo/Preço',
            render: (row) => (
                <div>
                    <p className="text-xs text-gray-500">C: R$ {row.cost.toFixed(2)}</p>
                    <p className="font-semibold dark:text-gray-300">V: R$ {row.price.toFixed(2)}</p>
                </div>
            )
        },
        {
            header: 'Markup',
            render: (row) => {
                const markup = row.cost > 0 ? ((row.price - row.cost) / row.cost * 100).toFixed(1) : '0';
                return <span className="text-gray-500 font-medium">{markup}%</span>;
            }
        },
        {
            header: 'Ações',
            render: () => (
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreVertical size={18} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" className="gap-2">
                        <Filter size={18} />
                        Filtros
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <Download size={18} />
                        Exportar
                    </Button>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Novo Produto
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={products} isLoading={loading} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Produto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input
                                required
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                            <input
                                required
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.sku}
                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estoque Mínimo</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.min_stock}
                                onChange={e => setFormData({ ...formData, min_stock: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custo (R$)</label>
                            <input
                                type="number" step="0.01"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço Venda (R$)</label>
                            <input
                                type="number" step="0.01"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar Produto</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
