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
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                    <div className="p-3 bg-indigo-50 text-[#4F46E5] rounded-[10px] shadow-sm">
                        <ArrowLeftRight size={22} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-[#111827] tracking-tight">Registrar Movimentação</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Gestão de Fluxo Atlas</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Produto</label>
                        <select
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] focus:bg-white transition-all appearance-none"
                            value={formData.product_id}
                            onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                        >
                            <option value="">Selecione um produto...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku}) - Est: {p.stock}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Operação</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['IN', 'OUT', 'ADJUST'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`
                                            py-3 text-[10px] font-bold rounded-[10px] border transition-all uppercase tracking-widest
                                            ${formData.type === type
                                                ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-lg shadow-indigo-100'
                                                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}
                                        `}
                                    >
                                        {type === 'IN' ? 'Entrada' : type === 'OUT' ? 'Saída' : 'Ajuste'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Quantidade</label>
                            <input
                                type="number" required min="1"
                                className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    {selectedProduct && formData.type === 'OUT' && selectedProduct.stock < formData.quantity && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-[10px] flex items-center gap-2 text-red-600 text-xs font-bold">
                            <AlertCircle size={16} />
                            Atenção: Estoque insuficiente no AtlasOne.
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Motivo / Observação</label>
                        <textarea
                            rows="3"
                            className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] focus:bg-white transition-all resize-none"
                            placeholder="Descreva o motivo da movimentação..."
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                        {selectedProduct && (
                            <div className="mb-6 flex items-center justify-between px-2 text-sm">
                                <span className="text-gray-400 font-medium">Estoque Projetado</span>
                                <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
                                    {formData.type === 'IN' ? selectedProduct.stock + formData.quantity :
                                        formData.type === 'OUT' ? selectedProduct.stock - formData.quantity :
                                            formData.quantity} un
                                </span>
                            </div>
                        )}
                        <Button type="submit" className="w-full py-4 text-base" disabled={loading || (selectedProduct && formData.type === 'OUT' && selectedProduct.stock < formData.quantity)}>
                            {loading ? 'Processando Movimentação...' : 'Confirmar no AtlasOne'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
