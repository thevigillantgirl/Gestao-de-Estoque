import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { History as HistoryIcon, Search, ArrowUpRight, ArrowDownLeft, Info, Package } from 'lucide-react';

const History = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        setLoading(true);
        try {
            const response = await api.get('/stock/movements');
            setMovements(response.data);
        } catch (error) {
            console.error('Erro ao buscar movimentações:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMovements = movements.filter(m =>
        m.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <HistoryIcon className="text-indigo-600" />
                        Histórico de Produtos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Rastreabilidade completa de todas as entradas e saídas</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por SKU do produto..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 border-b border-gray-100">Produto (SKU)</th>
                                <th className="px-6 py-4 border-b border-gray-100">Tipo</th>
                                <th className="px-6 py-4 border-b border-gray-100 text-right">Qtd</th>
                                <th className="px-6 py-4 border-b border-gray-100">Data</th>
                                <th className="px-6 py-4 border-b border-gray-100 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredMovements.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma movimentação encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredMovements.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-gray-400" />
                                                {m.product_sku}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${m.type === 'IN' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-red-700 bg-red-50 border border-red-100'
                                                }`}>
                                                {m.type === 'IN' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                {m.type === 'IN' ? 'Entrada' : 'Saída'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {m.type === 'IN' ? '+' : '-'}{m.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(m.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1" title="Ver detalhes">
                                                <Info size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
