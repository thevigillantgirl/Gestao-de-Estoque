import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Package, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import api from '../api/client';

export default function Stock() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_id: '',
        type: 'IN',
        quantity: 1,
        reason: ''
    });

    useEffect(() => {
        async function fetchProducts() {
            const res = await api.get('/products');
            setProducts(res.data);
        }
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.product_id) return alert('Selecione um produto');

        try {
            setLoading(true);
            await api.post('/stock/movements', {
                ...formData,
                product_id: parseInt(formData.product_id)
            });
            alert('Movimentação realizada com sucesso!');
            setFormData({ product_id: '', type: 'IN', quantity: 1, reason: '' });
        } catch (error) {
            alert(error.response?.data?.detail || 'Erro ao realizar movimentação');
        } finally {
            setLoading(false);
        }
    };

    const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <ArrowLeftRight size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registrar Movimentação</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produto</label>
                        <select
                            required
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={formData.product_id}
                            onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                        >
                            <option value="">Selecione um produto...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku}) - Est: {p.stock}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Operação</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['IN', 'OUT', 'ADJUST'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`
                      py-2 text-xs font-bold rounded-lg border transition-all
                      ${formData.type === type
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/30'
                                                : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'}
                    `}
                                    >
                                        {type === 'IN' ? 'Entrada (+)' : type === 'OUT' ? 'Saída (-)' : 'Ajuste (=)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
                            <input
                                type="number" required min="1"
                                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    {selectedProduct && formData.type === 'OUT' && selectedProduct.stock < formData.quantity && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-medium">
                            <AlertCircle size={16} />
                            Atenção: Estoque insuficiente para esta saída.
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo / Observação (Opcional)</label>
                        <textarea
                            rows="3"
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                            placeholder="Ex: Quebra de produto, devolução de cliente..."
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                        {selectedProduct && (
                            <div className="mb-4 flex items-center justify-between text-sm">
                                <span className="text-gray-500">Estoque projetado:</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {formData.type === 'IN' ? selectedProduct.stock + formData.quantity :
                                        formData.type === 'OUT' ? selectedProduct.stock - formData.quantity :
                                            formData.quantity} un
                                </span>
                            </div>
                        )}
                        <Button type="submit" className="w-full py-3" disabled={loading || (selectedProduct && formData.type === 'OUT' && selectedProduct.stock < formData.quantity)}>
                            {loading ? 'Processando...' : 'Confirmar Movimentação'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
