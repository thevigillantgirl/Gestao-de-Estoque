import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { ShieldCheck, Filter, Download, Search, Clock, User as UserIcon, Globe, Monitor } from 'lucide-react';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ user_id: '', event_type: '' });

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.user_id) params.append('user_id', filter.user_id);
            if (filter.event_type) params.append('event_type', filter.event_type);

            const response = await api.get(`/admin/logs?${params.toString()}`);
            setLogs(response.data);
        } catch (error) {
            console.error('Erro ao buscar logs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" />
                        Logs de Auditoria
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Registro completo de atividades do sistema</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                    <Download size={16} />
                    Exportar Logs
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filtrar por usuário ID..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={filter.user_id}
                            onChange={(e) => setFilter({ ...filter, user_id: e.target.value })}
                        />
                    </div>
                    <select
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={filter.event_type}
                        onChange={(e) => setFilter({ ...filter, event_type: e.target.value })}
                    >
                        <option value="">Todos os Eventos</option>
                        <option value="LOGIN_SUCCESS">Login Sucesso</option>
                        <option value="LOGIN_FAILED">Login Falha</option>
                        <option value="CREATE_PRODUCT">Criação de Produto</option>
                        <option value="STOCK_MOVEMENT">Movimentação de Estoque</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 border-b border-gray-100">Data/Hora</th>
                                <th className="px-6 py-4 border-b border-gray-100">Usuário</th>
                                <th className="px-6 py-4 border-b border-gray-100">Evento</th>
                                <th className="px-6 py-4 border-b border-gray-100">IP / Local</th>
                                <th className="px-6 py-4 border-b border-gray-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum registro encontrado para os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-gray-400" />
                                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {log.user_id || '?'}
                                                </div>
                                                <span className="font-medium text-gray-900">ID: {log.user_id || 'Visitante'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-white shadow-sm">
                                                {log.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Globe size={12} /> {log.ip_address}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] truncate max-w-[200px]">
                                                    <Monitor size={12} /> {log.user_agent}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${log.status_code < 400 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                                                }`}>
                                                {log.status_code}
                                            </span>
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

export default Logs;
